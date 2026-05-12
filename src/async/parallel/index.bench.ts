import { parallel as radashParallel } from "radash";
import { Bench } from "tinybench";
import { parallel } from "./index.js";

const bench = new Bench({ name: "parallel", time: 1000 });

const items = Array.from({ length: 50 }, (_, i) => i);
const work = async (n: number) => {
  await new Promise((r) => setTimeout(r, 0));
  return n * 2;
};

bench
  .add("1o1-utils (concurrency: 5, 50 items)", async () => {
    await parallel({ items, concurrency: 5, fn: work });
  })
  .add("radash (concurrency: 5, 50 items)", async () => {
    await radashParallel(5, items, work);
  })
  .add("native Promise.all (50 items, unbounded)", async () => {
    await Promise.all(items.map(work));
  })
  .add("native serial loop (50 items)", async () => {
    const out: number[] = [];
    for (const n of items) out.push(await work(n));
    return out;
  });

export { bench };
