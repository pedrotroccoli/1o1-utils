import { expect } from "chai";
import { describe, it } from "mocha";
import type { BenchSuiteResult } from "./collect.js";
import {
  appendHistory,
  type Baseline,
  type BenchStatus,
  buildReport,
  classifyStatus,
  computeVariance,
  decideExit,
  extractMetric,
  type MachineMeta,
  parseBaseline,
  type Report,
  type RunHistoryEntry,
  renderValidationMarkdown,
  summarizeRun,
} from "./validate.js";

const META: MachineMeta = {
  machine: "m1",
  os: "linux",
  arch: "x64",
  nodeVersion: "v22.0.0",
};

function baselineOf(benchmarks: Record<string, number>): Baseline {
  return { metric: "speedup-ratio", threshold: 0.15, benchmarks };
}

function reportOf(
  machine: string,
  statuses: Record<string, BenchStatus>,
): Report {
  return {
    machine,
    os: "linux",
    arch: "x64",
    nodeVersion: "v22.0.0",
    benchmarks: Object.entries(statuses).map(([name, status]) => ({
      name,
      result: 1,
      baseline: 1,
      variance: 0,
      status,
    })),
  };
}

describe("validate (benchmark validator)", () => {
  describe("computeVariance / classifyStatus", () => {
    it("passes a result 14% above baseline", () => {
      const v = computeVariance(1.14, 1);
      expect(v).to.be.closeTo(0.14, 1e-9);
      expect(classifyStatus(v)).to.equal("pass");
    });

    it("fails a result 16% above baseline", () => {
      const v = computeVariance(1.16, 1);
      expect(v).to.be.closeTo(0.16, 1e-9);
      expect(classifyStatus(v)).to.equal("fail");
    });

    it("is symmetric — fails 16% below baseline too", () => {
      expect(classifyStatus(computeVariance(0.84, 1))).to.equal("fail");
      expect(classifyStatus(computeVariance(0.86, 1))).to.equal("pass");
    });

    it("treats exactly ±15% as passing (inclusive boundary)", () => {
      expect(classifyStatus(0.15)).to.equal("pass");
      expect(classifyStatus(-0.15)).to.equal("pass");
    });

    it("honors a custom threshold", () => {
      expect(classifyStatus(0.2, 0.25)).to.equal("pass");
      expect(classifyStatus(0.3, 0.25)).to.equal("fail");
    });
  });

  describe("decideExit", () => {
    it("exits 0 with a warning when exactly 1 of 3 machines fails", () => {
      const reports = [
        reportOf("a", { bench: "fail" }),
        reportOf("b", { bench: "pass" }),
        reportOf("c", { bench: "pass" }),
      ];
      const { code, warnings, failures } = decideExit(reports);
      expect(code).to.equal(0);
      expect(failures).to.have.length(0);
      expect(warnings).to.deep.equal([{ name: "bench", failedMachines: 1 }]);
    });

    it("exits 1 when 2 of 3 machines fail the same benchmark", () => {
      const reports = [
        reportOf("a", { bench: "fail" }),
        reportOf("b", { bench: "fail" }),
        reportOf("c", { bench: "pass" }),
      ];
      const { code, failures, warnings } = decideExit(reports);
      expect(code).to.equal(1);
      expect(failures).to.deep.equal([{ name: "bench", failedMachines: 2 }]);
      expect(warnings).to.have.length(0);
    });

    it("exits 0 when all machines pass", () => {
      const reports = [
        reportOf("a", { bench: "pass" }),
        reportOf("b", { bench: "pass" }),
      ];
      expect(decideExit(reports).code).to.equal(0);
    });

    it("treats different benchmarks failing on single machines independently", () => {
      const reports = [
        reportOf("a", { x: "fail", y: "pass" }),
        reportOf("b", { x: "pass", y: "fail" }),
      ];
      const { code, warnings } = decideExit(reports);
      expect(code).to.equal(0);
      expect(warnings).to.have.length(2);
    });
  });

  describe("buildReport", () => {
    it("produces the exact schema and computed fields", () => {
      const baseline = baselineOf({ "suite / n=100": 2 });
      const report = buildReport(META, { "suite / n=100": 2.4 }, baseline);
      expect(report).to.deep.equal({
        machine: "m1",
        os: "linux",
        arch: "x64",
        nodeVersion: "v22.0.0",
        benchmarks: [
          {
            name: "suite / n=100",
            result: 2.4,
            baseline: 2,
            variance: computeVariance(2.4, 2),
            status: "fail",
          },
        ],
      });
    });

    it("marks a benchmark missing from this machine as a failure", () => {
      const baseline = baselineOf({ "suite / n=100": 2 });
      const report = buildReport(META, {}, baseline);
      expect(report.benchmarks[0]).to.deep.equal({
        name: "suite / n=100",
        result: null,
        baseline: 2,
        variance: null,
        status: "fail",
      });
    });

    it("iterates the baseline contract and ignores extra machine metrics", () => {
      const baseline = baselineOf({ a: 1, b: 1 });
      const report = buildReport(META, { a: 1, b: 1, c: 99 }, baseline);
      expect(report.benchmarks.map((b) => b.name)).to.deep.equal(["a", "b"]);
    });
  });

  describe("extractMetric", () => {
    it("computes own ÷ reference (lodash) speedup ratios per size", () => {
      const suites: BenchSuiteResult[] = [
        {
          name: "deepEqual",
          rows: [
            {
              lib: "1o1-utils",
              size: "small",
              opsMedian: 400,
              latencyMedian: 0,
            },
            { lib: "lodash", size: "small", opsMedian: 100, latencyMedian: 0 },
            { lib: "dequal", size: "small", opsMedian: 200, latencyMedian: 0 },
          ],
        },
      ];
      expect(extractMetric(suites)).to.deep.equal({ "deepEqual / small": 4 });
    });

    it("falls back to first non-1o1 lib when no lodash row exists", () => {
      const suites: BenchSuiteResult[] = [
        {
          name: "s",
          rows: [
            { lib: "1o1-utils", size: "n", opsMedian: 300, latencyMedian: 0 },
            { lib: "native", size: "n", opsMedian: 150, latencyMedian: 0 },
          ],
        },
      ];
      expect(extractMetric(suites)).to.deep.equal({ "s / n": 2 });
    });

    it("skips sizes with no comparison library or zero-ops reference", () => {
      const suites: BenchSuiteResult[] = [
        {
          name: "s",
          rows: [
            {
              lib: "1o1-utils",
              size: "solo",
              opsMedian: 300,
              latencyMedian: 0,
            },
            {
              lib: "1o1-utils",
              size: "zero",
              opsMedian: 300,
              latencyMedian: 0,
            },
            { lib: "lodash", size: "zero", opsMedian: 0, latencyMedian: 0 },
          ],
        },
      ];
      expect(extractMetric(suites)).to.deep.equal({});
    });
  });

  describe("parseBaseline", () => {
    it("parses a valid baseline", () => {
      const text = JSON.stringify(baselineOf({ "a / b": 1.5 }));
      expect(parseBaseline(text).benchmarks).to.deep.equal({ "a / b": 1.5 });
    });

    it("throws a clear error on invalid JSON", () => {
      expect(() => parseBaseline("{ not json")).to.throw(/not valid JSON/);
    });

    it("throws when the benchmarks object is missing", () => {
      expect(() => parseBaseline(JSON.stringify({ metric: "x" }))).to.throw(
        /missing a "benchmarks" object/,
      );
    });

    it("throws when a benchmark value is not a finite number", () => {
      const text = JSON.stringify({ benchmarks: { a: "fast" } });
      expect(() => parseBaseline(text)).to.throw(/must be a finite number/);
    });
  });

  describe("summarizeRun", () => {
    const meta = { date: "2026-01-01T00:00:00.000Z", commit: "abc1234def" };

    it("derives outcome=pass when no machine fails", () => {
      const reports = [
        reportOf("a", { x: "pass" }),
        reportOf("b", { x: "pass" }),
      ];
      const entry = summarizeRun(reports, decideExit(reports), meta);
      expect(entry.outcome).to.equal("pass");
      expect(entry.machines).to.have.length(2);
      expect(entry.machines[0]).to.include({
        machine: "a",
        total: 1,
        pass: 1,
        fail: 0,
      });
    });

    it("derives outcome=warn when exactly 1 machine fails", () => {
      const reports = [
        reportOf("a", { x: "fail" }),
        reportOf("b", { x: "pass" }),
      ];
      const entry = summarizeRun(reports, decideExit(reports), meta);
      expect(entry.outcome).to.equal("warn");
      expect(entry.warnings).to.deep.equal([{ name: "x", failedMachines: 1 }]);
    });

    it("derives outcome=fail when ≥2 machines fail the same benchmark", () => {
      const reports = [
        reportOf("a", { x: "fail" }),
        reportOf("b", { x: "fail" }),
      ];
      const entry = summarizeRun(reports, decideExit(reports), meta);
      expect(entry.outcome).to.equal("fail");
      expect(entry.failures).to.deep.equal([{ name: "x", failedMachines: 2 }]);
    });
  });

  describe("appendHistory", () => {
    const mk = (commit: string): RunHistoryEntry => ({
      date: "d",
      commit,
      outcome: "pass",
      machines: [],
      failures: [],
      warnings: [],
    });

    it("appends newest last", () => {
      const out = appendHistory([mk("a")], mk("b"));
      expect(out.map((e) => e.commit)).to.deep.equal(["a", "b"]);
    });

    it("keeps at most `limit` most-recent runs", () => {
      const existing = [mk("a"), mk("b"), mk("c")];
      const out = appendHistory(existing, mk("d"), 2);
      expect(out.map((e) => e.commit)).to.deep.equal(["c", "d"]);
    });
  });

  describe("renderValidationMarkdown", () => {
    const entry: RunHistoryEntry = {
      date: "2026-01-01T00:00:00.000Z",
      commit: "abc1234def5678",
      outcome: "warn",
      machines: [
        {
          machine: "m",
          os: "linux",
          arch: "x64",
          nodeVersion: "v22",
          total: 5,
          pass: 4,
          fail: 1,
        },
      ],
      failures: [],
      warnings: [{ name: "chunk / n=100", failedMachines: 1 }],
    };

    it("renders latest badge, machine table, warnings and history", () => {
      const md = renderValidationMarkdown(entry, [entry]);
      expect(md).to.include("# Benchmark validation");
      expect(md).to.include("⚠️ WARN");
      expect(md).to.include("`abc1234`"); // short sha
      expect(md).to.include("| m | linux/x64 | v22 | 4 | 1 |");
      expect(md).to.include("chunk / n=100");
      expect(md).to.include("## History");
    });
  });
});
