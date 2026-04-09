import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Bench } from "tinybench";

async function discoverBenchFiles(): Promise<string[]> {
  const srcDir = resolve(import.meta.dirname, "..");
  const entries = await readdir(srcDir, { recursive: true });
  return entries
    .filter((e) => e.endsWith(".bench.ts"))
    .map((e) => join(srcDir, e))
    .sort();
}

async function main() {
  const benchFiles = await discoverBenchFiles();

  console.log(`\nFound ${benchFiles.length} benchmark suite(s)\n`);
  console.log("=".repeat(80));

  for (const file of benchFiles) {
    const mod = await import(pathToFileURL(file).href);
    const bench: Bench = mod.bench;

    console.log(`\n  ${bench.name}\n`);

    await bench.run();
    console.table(bench.table());

    console.log("=".repeat(80));
  }

  console.log("\nDone.\n");
}

main().catch(console.error);
