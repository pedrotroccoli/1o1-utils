import { mkdir, readdir, writeFile } from "node:fs/promises";
import { arch, platform, release } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Bench, Task } from "tinybench";

const isCI = process.argv.includes("--ci");
if (isCI) process.env.BENCH_CI = "1";
const writeMd = process.argv.includes("--md");
const filter = process.argv.find(
  (a) =>
    a !== "--ci" && a !== "--md" && !a.startsWith("/") && !a.includes("run.ts"),
);
const rootDir = resolve(import.meta.dirname, "../..");
const benchDir = join(rootDir, "docs", "benchmarks");

// --- Discovery ---

async function discoverBenchFiles(): Promise<string[]> {
  const srcDir = resolve(import.meta.dirname, "..");
  const entries = await readdir(srcDir, { recursive: true });
  return entries
    .filter((e) => e.endsWith(".bench.ts"))
    .map((e) => join(srcDir, e))
    .sort();
}

// --- Formatting helpers ---

function formatOps(ops: number): string {
  if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(1)}M ops/s`;
  if (ops >= 1_000) return `${(ops / 1_000).toFixed(1)}K ops/s`;
  return `${Math.round(ops)} ops/s`;
}

function formatLatency(ms: number): string {
  const ns = ms * 1_000_000;
  if (ns < 1_000) return `${Math.round(ns)}ns`;
  const us = ns / 1_000;
  if (us < 1_000) return `${us.toFixed(1)}µs`;
  if (ms < 100) return `${ms.toFixed(2)}ms`;
  return `${ms.toFixed(1)}ms`;
}

function formatMultiplier(a: number, b: number): string {
  if (b === 0) return "—";
  const ratio = a / b;
  if (ratio >= 1.05) return `${ratio.toFixed(1)}× faster`;
  if (ratio <= 0.95) return `${(1 / ratio).toFixed(1)}× slower`;
  return "on par";
}

// --- Parse task results ---

interface TaskRow {
  lib: string;
  size: string;
  opsMedian: number;
  latencyMedian: number;
}

function parseTask(task: Task): TaskRow | null {
  const r = task.result;
  if (!r || !("latency" in r)) return null;

  const match = task.name.match(/^(.+?)\s*\((.+)\)$/);
  if (!match) return null;

  return {
    lib: match[1].trim(),
    size: match[2].trim(),
    opsMedian: r.throughput.p50,
    latencyMedian: r.latency.p50,
  };
}

// --- Markdown generation ---

interface SuiteResult {
  name: string;
  slug: string;
  rows: TaskRow[];
}

const SUITE_META: Record<string, { slug: string; description: string }> = {
  cloneDeep: {
    slug: "clone-deep",
    description:
      "Creates a deep clone of a value. Handles objects, arrays, dates, regexes, maps, sets, typed arrays, and circular references. Compared against `lodash.cloneDeep`, `radash.clone`, and native `structuredClone`.\n\n> **Note:** `radash.clone` is **not a true deep clone** — nested objects, arrays, Maps, and Sets keep their original references. Its numbers are shown for reference only and are not comparable to the others.",
  },
  chunk: {
    slug: "chunk",
    description:
      "Splits an array into groups of the given size. Compared against `lodash.chunk` and a native `for + slice` loop.",
  },
  omit: {
    slug: "omit",
    description:
      "Omits specified keys from an object, with support for nested dot notation. Compared against `lodash.omit` and `radash.omit`.",
  },
  pick: {
    slug: "pick",
    description:
      "Picks specified keys from an object, with support for nested dot notation. Compared against `lodash.pick` and `radash.pick`.",
  },
  "unique (by key)": {
    slug: "unique",
    description:
      "Removes duplicate items from an array by a given key. Compared against `lodash.uniqBy`, `radash.unique`, and a native `Set + filter` approach.",
  },
  groupBy: {
    slug: "group-by",
    description:
      "Groups array items by a given key. Compared against `lodash.groupBy`, `radash.group`, and a native `reduce` approach.",
  },
  "arrayToHash / keyBy": {
    slug: "array-to-hash",
    description:
      "Converts an array into a hash/object keyed by a given property. Compared against `lodash.keyBy`, `radash.objectify`, and a native `for` loop.",
  },
  isEmpty: {
    slug: "is-empty",
    description:
      "Checks if a value is empty (null, undefined, empty string, empty array, empty object, empty Map/Set). Compared against `lodash.isEmpty` and `radash.isEmpty`.",
  },
  sleep: {
    slug: "sleep",
    description:
      "Async delay function. Compared against `radash.sleep` and native `setTimeout`.",
  },
  retry: {
    slug: "retry",
    description:
      "Retries an async function with configurable attempts, delay, and backoff strategy. Compared against `radash.retry` and a native retry loop.",
  },
  capitalize: {
    slug: "capitalize",
    description:
      "Capitalizes the first letter of a string. Compared against `lodash.capitalize`.",
  },
  transformCase: {
    slug: "transform-case",
    description:
      "Transforms strings between camelCase, kebab-case, snake_case, PascalCase, and Title Case, with optional acronym preservation. Compared against lodash case functions.",
  },
  debounce: {
    slug: "debounce",
    description:
      "Delays function execution until after a specified quiet period. Compared against `lodash.debounce`.",
  },
  throttle: {
    slug: "throttle",
    description:
      "Limits function execution to once per specified time window. Compared against `lodash.throttle`.",
  },
  defaults: {
    slug: "defaults",
    description:
      'Fills `undefined` properties in the target with values from the source. Existing `null`, `0`, `""`, and `false` values are preserved. Compared against `lodash.defaults` and a native `Object.assign` spread.',
  },
  defaultsDeep: {
    slug: "defaults-deep",
    description:
      "Recursively fills `undefined` properties in the target with values from the source. Arrays and non-plain-object values in the target are preserved. Compared against `lodash.defaultsDeep`.",
  },
  once: {
    slug: "once",
    description:
      "Wraps a function so it runs at most once; subsequent calls return the cached result. Compared against `lodash.once`.",
  },
  memo: {
    slug: "memo",
    description:
      "Memoizes a function with optional TTL and custom cache key. Compared against `lodash.memoize` for wrapper creation, cache hits, and cache misses.",
  },
  inRange: {
    slug: "in-range",
    description:
      "Checks if a number falls within a given range (inclusive start, exclusive end). Compared against `lodash.inRange`, `radash.inRange`, and a native equivalent.",
  },
  shallowEqual: {
    slug: "shallow-equal",
    description:
      "Compares two values by their top-level entries using `Object.is`. Compared against `lodash.isEqual` (deep) and a native `Object.keys` based implementation.",
  },
  isValidUrl: {
    slug: "is-valid-url",
    description:
      "Validates a string against the WHATWG `URL` parser. Compared against a native `try/catch` `new URL` implementation and a regex-based check.",
  },
  isValidEmail: {
    slug: "is-valid-email",
    description:
      "Validates a string against the HTML5 living-standard email pattern with RFC 5321 length limits. Compared against a simple regex and a native `indexOf`/`lastIndexOf` structural check.\n\n> **Note:** `simple regex` and `native string check` are coarse baselines — they do not validate hostname-label structure (hyphen rules, label length), so they accept many addresses 1o1-utils correctly rejects. Their numbers are shown for reference only and are not apples-to-apples.",
  },
  isValidPhone: {
    slug: "is-valid-phone",
    description:
      "Validates a string as a well-formed E.164 international phone number. Strips common separators (spaces, hyphens, parentheses, dots) before checking for a leading `+`, a non-zero country code, and 1–15 total digits. Compared against a simple regex and a native char-code structural check.\n\n> **Note:** baselines do not strip separators or enforce E.164's non-zero country-code rule, so they accept inputs 1o1-utils rejects. Numbers shown for reference only.",
  },
  normalizeEmail: {
    slug: "normalize-email",
    description:
      "Normalizes an email: trim, lowercase, and optionally strip plus-addressing (`user+tag@x.com` → `user@x.com`). Compared against a native `trim().toLowerCase()` baseline and a regex-based plus-stripper.",
  },
  deburr: {
    slug: "deburr",
    description:
      "Strips diacritics (accents) from a string via Unicode NFD normalization. Compared against a native inline `normalize('NFD').replace(...)` baseline.",
  },
  zip: {
    slug: "zip",
    description:
      "Combines arrays by index into tuples, with `fill` (default) or `truncate` strategy for uneven lengths. Compared against `lodash.zip`, `radash.zip`, and a native `for` loop hardcoded for the fixed shape.",
  },
  unzip: {
    slug: "unzip",
    description:
      "Splits an array of grouped tuples back into separate arrays — the inverse of `zip`. Compared against `lodash.unzip` and a native `for` loop hardcoded for the fixed shape.",
  },
  mapKeys: {
    slug: "map-keys",
    description:
      "Transforms an object's keys via an iteratee function. Compared against `lodash.mapKeys` and a native `Object.fromEntries(Object.entries().map())` approach.",
  },
  mapValues: {
    slug: "map-values",
    description:
      "Transforms an object's values via an iteratee function. Compared against `lodash.mapValues` and a native `Object.fromEntries(Object.entries().map())` approach.",
  },
  "partition (by role)": {
    slug: "partition",
    description:
      "Splits an array into two groups based on a predicate. Compared against `lodash.partition`, a native two-`filter` approach, and a native single-pass loop.",
  },
  "replace (by id)": {
    slug: "replace",
    description:
      "Replaces element(s) in an array by predicate, returning a new array. Compared against a native `map` ternary and a native single-pass `for` loop. Both first-match (default) and `all: true` modes are benchmarked.",
  },
};

function getSizes(rows: TaskRow[]): string[] {
  const seen = new Set<string>();
  const sizes: string[] = [];
  for (const r of rows) {
    if (!seen.has(r.size)) {
      seen.add(r.size);
      sizes.push(r.size);
    }
  }
  return sizes;
}

function getLibs(rows: TaskRow[]): string[] {
  const seen = new Set<string>();
  const libs: string[] = [];
  for (const r of rows) {
    if (!seen.has(r.lib)) {
      seen.add(r.lib);
      libs.push(r.lib);
    }
  }
  return libs;
}

function findLodashLib(libs: string[]): string | undefined {
  return libs.find((l) => l.toLowerCase().includes("lodash"));
}

function generateSuiteMarkdown(suite: SuiteResult): string {
  const meta = SUITE_META[suite.name];
  const sizes = getSizes(suite.rows);
  const libs = getLibs(suite.rows);
  const lodashLib = findLodashLib(libs);

  const lines: string[] = [];
  lines.push(`# ${suite.name}`);
  lines.push("");
  lines.push("[← Back to benchmarks](./README.md)");
  lines.push("");
  if (meta?.description) {
    lines.push(meta.description);
    lines.push("");
  }
  lines.push("---");
  lines.push("");

  // Table header
  const headers = ["Size", ...libs, "Fastest"];
  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "------").join(" | ")} |`);

  // Table rows
  for (const size of sizes) {
    const sizeRows = suite.rows.filter((r) => r.size === size);
    const fastest = sizeRows.reduce((a, b) =>
      a.opsMedian > b.opsMedian ? a : b,
    );
    const lodashRow = lodashLib
      ? sizeRows.find((r) => r.lib === lodashLib)
      : undefined;

    const cells: string[] = [size];
    for (const lib of libs) {
      const row = sizeRows.find((r) => r.lib === lib);
      if (row) {
        cells.push(
          `${formatLatency(row.latencyMedian)} · ${formatOps(row.opsMedian)}`,
        );
      } else {
        cells.push("—");
      }
    }

    // Fastest cell
    if (lodashRow && lodashRow.opsMedian > 0) {
      const mult = formatMultiplier(fastest.opsMedian, lodashRow.opsMedian);
      cells.push(`${fastest.lib} · ${mult} vs lodash`);
    } else {
      cells.push(fastest.lib);
    }

    lines.push(`| ${cells.join(" | ")} |`);
  }

  // Mermaid chart (use largest dataset with > 2 ops/s for readability)
  const chartSize = [...sizes].reverse().find((s) => {
    const sizeRows = suite.rows.filter((r) => r.size === s);
    return sizeRows.every((r) => r.opsMedian > 2);
  });

  if (chartSize) {
    const chartRows = suite.rows
      .filter((r) => r.size === chartSize)
      .sort((a, b) => b.opsMedian - a.opsMedian);

    lines.push("");
    lines.push("```mermaid");
    lines.push("xychart-beta horizontal");
    lines.push(`  title "${suite.name} — ops/s at ${chartSize} items"`);
    lines.push(`  x-axis [${chartRows.map((r) => `"${r.lib}"`).join(", ")}]`);
    lines.push(
      `  bar [${chartRows.map((r) => Math.round(r.opsMedian)).join(", ")}]`,
    );
    lines.push("```");
  }

  lines.push("");
  return lines.join("\n");
}

function generateReadme(suites: SuiteResult[]): string {
  const lines: string[] = [];
  lines.push("# Benchmarks");
  lines.push("");
  lines.push(
    "Performance comparison of 1o1-utils against lodash, radash, and native JavaScript.",
  );
  lines.push("");
  lines.push("Run `pnpm bench` to reproduce these results locally.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Results");
  lines.push("");

  for (const suite of suites) {
    const meta = SUITE_META[suite.name];
    const slug = meta?.slug ?? suite.name.toLowerCase().replace(/\s+/g, "-");
    const libs = getLibs(suite.rows);
    const lodashLib = findLodashLib(libs);

    // Compute overall verdict
    let verdict = "";
    if (lodashLib) {
      const ownRows = suite.rows.filter((r) => r.lib === "1o1-utils");
      const lodashRows = suite.rows.filter((r) => r.lib === lodashLib);
      if (ownRows.length > 0 && lodashRows.length > 0) {
        const ratios = ownRows
          .map((o) => {
            const l = lodashRows.find((lr) => lr.size === o.size);
            return l && l.opsMedian > 0 ? o.opsMedian / l.opsMedian : null;
          })
          .filter((r): r is number => r !== null);

        if (ratios.length > 0) {
          const min = Math.min(...ratios);
          const max = Math.max(...ratios);
          if (min >= 1.05) {
            if (max - min < 0.5) {
              verdict = `**${min.toFixed(1)}× faster** than lodash`;
            } else {
              verdict = `**${min.toFixed(1)}–${max.toFixed(1)}× faster** than lodash`;
            }
          } else if (max <= 0.95) {
            verdict = `${(1 / max).toFixed(1)}× slower than lodash`;
          } else {
            verdict = "on par with lodash";
          }
        }
      }
    }

    lines.push(
      `- [${suite.name}](./${slug}.md)${verdict ? ` — ${verdict}` : ""}`,
    );
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Utility | vs lodash | vs radash | vs native |");
  lines.push("| ------- | --------- | --------- | --------- |");

  for (const suite of suites) {
    const libs = getLibs(suite.rows);
    const lodashLib = findLodashLib(libs);
    const radashLib = libs.find((l) => l.toLowerCase().includes("radash"));
    const nativeLib = libs.find((l) => l.toLowerCase().startsWith("native"));

    const computeVerdict = (targetLib: string | undefined): string => {
      if (!targetLib) return "—";
      const ownRows = suite.rows.filter((r) => r.lib === "1o1-utils");
      const targetRows = suite.rows.filter((r) => r.lib === targetLib);
      if (ownRows.length === 0 || targetRows.length === 0) return "—";

      const ratios = ownRows
        .map((o) => {
          const t = targetRows.find((tr) => tr.size === o.size);
          return t && t.opsMedian > 0 ? o.opsMedian / t.opsMedian : null;
        })
        .filter((r): r is number => r !== null);

      if (ratios.length === 0) return "—";
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      if (avg >= 1.05) return `**${avg.toFixed(1)}× faster**`;
      if (avg <= 0.95) return `${(1 / avg).toFixed(1)}× slower`;
      return "on par";
    };

    lines.push(
      `| ${suite.name} | ${computeVerdict(lodashLib)} | ${computeVerdict(radashLib)} | ${computeVerdict(nativeLib)} |`,
    );
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Environment");
  lines.push("");
  lines.push(`- **Machine**: ${arch()}`);
  lines.push(`- **Runtime**: Node.js ${process.version}`);
  lines.push(`- **OS**: ${platform()} ${release()}`);
  lines.push("- **Benchmark tool**: tinybench v6");
  lines.push(`- **Date**: ${new Date().toISOString().split("T")[0]}`);
  lines.push("- **Source**: [`src/**/*.bench.ts`](../src/)");
  lines.push("");
  return lines.join("\n");
}

// --- Main ---

async function main() {
  let benchFiles = await discoverBenchFiles();

  if (filter) {
    const lower = filter.toLowerCase();
    benchFiles = benchFiles.filter((f) => f.toLowerCase().includes(lower));
    if (benchFiles.length === 0) {
      console.log(`\nNo benchmark suites matching "${filter}"\n`);
      return;
    }
  }

  console.log(`\nFound ${benchFiles.length} benchmark suite(s)`);
  if (filter) console.log(`(filtered by "${filter}")`);
  if (isCI) console.log("(CI mode: capped at 1M items)");
  console.log("");
  console.log("=".repeat(80));

  const suites: SuiteResult[] = [];

  for (const file of benchFiles) {
    const mod = await import(pathToFileURL(file).href);
    const bench: Bench = mod.bench;

    console.log(`\n  ${bench.name}\n`);

    await bench.run();
    console.table(bench.table());

    // Collect results
    const rows: TaskRow[] = [];
    for (const task of bench.tasks) {
      const row = parseTask(task);
      if (row) rows.push(row);
    }

    const meta = SUITE_META[bench.name];
    suites.push({
      name: bench.name,
      slug: meta?.slug ?? bench.name.toLowerCase().replace(/\s+/g, "-"),
      rows,
    });

    console.log("=".repeat(80));
  }

  // Write markdown files (skip README when filtered)
  if (!filter || writeMd) {
    await mkdir(benchDir, { recursive: true });

    for (const suite of suites) {
      const md = generateSuiteMarkdown(suite);
      await writeFile(join(benchDir, `${suite.slug}.md`), md);
      console.log(`  wrote benchmarks/${suite.slug}.md`);
    }

    if (!filter) {
      const readme = generateReadme(suites);
      await writeFile(join(benchDir, "README.md"), readme);
      console.log("  wrote benchmarks/README.md");
    }
  }

  console.log("\nDone.\n");
}

main().catch(console.error);
