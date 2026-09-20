import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { arch, hostname } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type BenchSuiteResult,
  discoverBenchFiles,
  runBenchmarks,
} from "./collect.js";

// ---------------------------------------------------------------------------
// Cross-machine benchmark validator (issue #181).
//
// Metric: hardware-independent *speedup ratio* = 1o1-utils ops ÷ reference-lib
// ops, measured in the same run on the same machine. Each machine compares its
// ratios against a stored baseline; a result is valid within ±15%. Across
// machines: ≥2 failing the same benchmark fails the run (exit 1); exactly 1
// failing is a non-blocking warning (exit 0).
// ---------------------------------------------------------------------------

export const OWN_LIB = "1o1-utils";
export const DEFAULT_THRESHOLD = 0.15;
export const METRIC = "speedup-ratio";

export type BenchStatus = "pass" | "fail";

export interface Baseline {
  metric: string;
  threshold: number;
  /** Reference machine label the baseline was generated on (informational). */
  generatedOn?: string;
  /** Map of `"<suite> / <size>"` → expected speedup ratio. */
  benchmarks: Record<string, number>;
}

export interface BenchmarkEntry {
  name: string;
  result: number | null;
  baseline: number;
  variance: number | null;
  status: BenchStatus;
}

export interface MachineMeta {
  machine: string;
  os: string;
  arch: string;
  nodeVersion: string;
}

export interface Report extends MachineMeta {
  benchmarks: BenchmarkEntry[];
}

export interface ExitDecision {
  code: 0 | 1;
  /** Benchmarks where ≥2 machines failed — these gate the run. */
  failures: { name: string; failedMachines: number }[];
  /** Benchmarks where exactly 1 machine failed — non-blocking. */
  warnings: { name: string; failedMachines: number }[];
}

// --- Pure core (unit-tested, no IO) ---------------------------------------

/**
 * Parses and validates baseline JSON. Throws a clear error on missing or
 * malformed input rather than failing silently.
 */
export function parseBaseline(text: string): Baseline {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `baseline.json is not valid JSON: ${(err as Error).message}`,
    );
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("baseline.json must be a JSON object");
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.benchmarks !== "object" || obj.benchmarks === null) {
    throw new Error('baseline.json is missing a "benchmarks" object');
  }
  const benchmarks = obj.benchmarks as Record<string, unknown>;
  for (const [name, value] of Object.entries(benchmarks)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(
        `baseline.json benchmark "${name}" must be a finite number, got ${String(value)}`,
      );
    }
  }
  return {
    metric: typeof obj.metric === "string" ? obj.metric : METRIC,
    threshold:
      typeof obj.threshold === "number" ? obj.threshold : DEFAULT_THRESHOLD,
    generatedOn:
      typeof obj.generatedOn === "string" ? obj.generatedOn : undefined,
    benchmarks: benchmarks as Record<string, number>,
  };
}

function findReference(
  rows: BenchSuiteResult["rows"],
): BenchSuiteResult["rows"][number] | undefined {
  return (
    rows.find((r) => r.lib.toLowerCase().includes("lodash")) ??
    rows.find((r) => r.lib !== OWN_LIB)
  );
}

/**
 * Derives the hardware-independent speedup ratio (own ÷ reference) for every
 * `(suite, size)` that has both a 1o1-utils row and a comparison row. Sizes
 * with no comparison library are skipped.
 */
export function extractMetric(
  suites: BenchSuiteResult[],
): Record<string, number> {
  const metrics: Record<string, number> = {};
  for (const suite of suites) {
    const sizes: string[] = [];
    const seen = new Set<string>();
    for (const r of suite.rows) {
      if (!seen.has(r.size)) {
        seen.add(r.size);
        sizes.push(r.size);
      }
    }
    for (const size of sizes) {
      const sizeRows = suite.rows.filter((r) => r.size === size);
      const own = sizeRows.find((r) => r.lib === OWN_LIB);
      if (!own) continue;
      const ref = findReference(sizeRows);
      if (!ref || ref.opsMedian <= 0) continue;
      metrics[`${suite.name} / ${size}`] = own.opsMedian / ref.opsMedian;
    }
  }
  return metrics;
}

/** Signed deviation from baseline as a fraction, e.g. 0.14 = 14% above. */
export function computeVariance(result: number, baseline: number): number {
  return (result - baseline) / baseline;
}

export function classifyStatus(
  variance: number,
  threshold: number = DEFAULT_THRESHOLD,
): BenchStatus {
  return Math.abs(variance) <= threshold ? "pass" : "fail";
}

/**
 * Builds a per-machine report against the baseline. Iterates over baseline
 * benchmarks (the contract): a benchmark absent from this machine's run is a
 * failure, not a silent skip.
 */
export function buildReport(
  meta: MachineMeta,
  metrics: Record<string, number>,
  baseline: Baseline,
): Report {
  const benchmarks: BenchmarkEntry[] = Object.keys(baseline.benchmarks)
    .sort()
    .map((name) => {
      const base = baseline.benchmarks[name];
      const result = metrics[name];
      if (result === undefined) {
        return {
          name,
          result: null,
          baseline: base,
          variance: null,
          status: "fail" as const,
        };
      }
      const variance = computeVariance(result, base);
      return {
        name,
        result,
        baseline: base,
        variance,
        status: classifyStatus(variance, baseline.threshold),
      };
    });
  return { ...meta, benchmarks };
}

/**
 * Applies the cross-machine exit policy: ≥2 machines failing the same
 * benchmark fails the run (exit 1); exactly 1 is a non-blocking warning.
 */
export function decideExit(reports: Report[]): ExitDecision {
  const failCounts = new Map<string, number>();
  for (const report of reports) {
    for (const b of report.benchmarks) {
      if (b.status === "fail") {
        failCounts.set(b.name, (failCounts.get(b.name) ?? 0) + 1);
      }
    }
  }
  const failures: ExitDecision["failures"] = [];
  const warnings: ExitDecision["warnings"] = [];
  for (const [name, count] of failCounts) {
    if (count >= 2) failures.push({ name, failedMachines: count });
    else if (count === 1) warnings.push({ name, failedMachines: count });
  }
  failures.sort((a, b) => a.name.localeCompare(b.name));
  warnings.sort((a, b) => a.name.localeCompare(b.name));
  return { code: failures.length > 0 ? 1 : 0, failures, warnings };
}

// --- IO / CLI --------------------------------------------------------------

const rootDir = resolve(import.meta.dirname, "../..");
const baselinePath = join(rootDir, "benchmarks", "baseline.json");
const reportPath = join(rootDir, "benchmark-validation-report.json");

function machineMeta(): MachineMeta {
  return {
    machine: hostname(),
    os: process.platform,
    arch: arch(),
    nodeVersion: process.version,
  };
}

async function collectMetrics(): Promise<Record<string, number>> {
  // Deterministic, capped datasets so baseline and validation are comparable
  // and re-runs are idempotent on stable hardware.
  process.env.BENCH_CI = "1";
  const files = await discoverBenchFiles();
  const suites = await runBenchmarks(files);
  return extractMetric(suites);
}

async function loadBaseline(): Promise<Baseline> {
  let text: string;
  try {
    text = await readFile(baselinePath, "utf8");
  } catch {
    throw new Error(
      `baseline not found at ${baselinePath}. Generate it with: pnpm bench:baseline`,
    );
  }
  return parseBaseline(text);
}

async function runValidate(): Promise<void> {
  const baseline = await loadBaseline();
  const metrics = await collectMetrics();
  const report = buildReport(machineMeta(), metrics, baseline);
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  const failed = report.benchmarks.filter((b) => b.status === "fail");
  console.log(`\nMachine: ${report.machine} (${report.os}/${report.arch})`);
  console.log(`Node: ${report.nodeVersion}`);
  console.log(
    `Benchmarks: ${report.benchmarks.length}, failed: ${failed.length}`,
  );
  for (const b of failed) {
    const v =
      b.variance === null ? "missing" : `${(b.variance * 100).toFixed(1)}%`;
    console.log(`  FAIL ${b.name}: variance ${v}`);
  }
  console.log(`\nWrote ${reportPath}`);
  // A single machine never decides the run — aggregation does.
}

async function runUpdateBaseline(): Promise<void> {
  const metrics = await collectMetrics();
  const sorted: Record<string, number> = {};
  for (const name of Object.keys(metrics).sort()) sorted[name] = metrics[name];
  const baseline: Baseline = {
    metric: METRIC,
    threshold: DEFAULT_THRESHOLD,
    generatedOn: `${process.platform}-${arch()}`,
    benchmarks: sorted,
  };
  await mkdir(dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(
    `\nWrote baseline with ${Object.keys(sorted).length} benchmarks to ${baselinePath}`,
  );
}

async function runAggregate(dir: string): Promise<void> {
  const entries = await readdir(dir, { recursive: true });
  const files = entries
    .filter((e) => typeof e === "string" && e.endsWith(".json"))
    .map((e) => join(dir, e));

  const reports: Report[] = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    const parsed = JSON.parse(text) as Report;
    if (Array.isArray(parsed.benchmarks)) reports.push(parsed);
  }

  if (reports.length === 0) {
    throw new Error(`no benchmark report JSON files found under ${dir}`);
  }

  const { code, failures, warnings } = decideExit(reports);
  console.log(`\nAggregated ${reports.length} machine report(s):`);
  for (const r of reports) console.log(`  - ${r.machine} (${r.os}/${r.arch})`);

  for (const w of warnings) {
    console.log(
      `\n::warning::${w.name} failed on ${w.failedMachines} machine (non-blocking)`,
    );
  }
  for (const f of failures) {
    console.log(`\n::error::${f.name} failed on ${f.failedMachines} machines`);
  }

  console.log(
    `\nResult: ${code === 0 ? "PASS" : "FAIL"} (${failures.length} blocking, ${warnings.length} warning)`,
  );
  process.exit(code);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const aggregateIdx = args.indexOf("--aggregate");
  if (aggregateIdx !== -1) {
    const dir = args[aggregateIdx + 1];
    if (!dir) throw new Error("--aggregate requires a directory argument");
    await runAggregate(dir);
    return;
  }
  if (args.includes("--update-baseline")) {
    await runUpdateBaseline();
    return;
  }
  await runValidate();
}

// Run only when executed directly (not when imported by tests).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
