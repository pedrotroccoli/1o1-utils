import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Bench, Task } from "tinybench";

// --- Discovery ---

export async function discoverBenchFiles(): Promise<string[]> {
  const srcDir = resolve(import.meta.dirname, "..");
  const entries = await readdir(srcDir, { recursive: true });
  return entries
    .filter((e) => e.endsWith(".bench.ts"))
    .map((e) => join(srcDir, e))
    .sort();
}

// --- Parse task results ---

export interface TaskRow {
  lib: string;
  size: string;
  opsMedian: number;
  latencyMedian: number;
}

export function parseTask(task: Task): TaskRow | null {
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

// --- Run ---

export interface BenchSuiteResult {
  name: string;
  rows: TaskRow[];
}

/**
 * Imports and runs each given `.bench.ts` file, returning normalized rows
 * grouped by suite. Shared by the markdown generator (`run.ts`) and the
 * cross-machine validator (`validate.ts`).
 *
 * Dataset sizes are controlled by the `BENCH_CI` env var, which is read by the
 * bench files at import time — callers must set it before invoking this.
 */
export async function runBenchmarks(
  files: string[],
  opts: { verbose?: boolean } = {},
): Promise<BenchSuiteResult[]> {
  const suites: BenchSuiteResult[] = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);
    const bench: Bench = mod.bench;

    if (opts.verbose) console.log(`\n  ${bench.name}\n`);

    await bench.run();

    if (opts.verbose) {
      console.table(bench.table());
      console.log("=".repeat(80));
    }

    const rows: TaskRow[] = [];
    for (const task of bench.tasks) {
      const row = parseTask(task);
      if (row) rows.push(row);
    }

    suites.push({ name: bench.name, rows });
  }

  return suites;
}
