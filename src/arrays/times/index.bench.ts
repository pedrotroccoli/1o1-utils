import lodashTimes from "lodash/times.js";
import { Bench } from "tinybench";
import { times } from "./index.js";

const SIZES = [
  { name: "n=10", count: 10 },
  { name: "n=1k", count: 1_000 },
  { name: "n=100k", count: 100_000 },
];

const fn = (i: number) => i * 2;

const bench = new Bench({ name: "times", time: 1000 });

for (const { name, count } of SIZES) {
  bench
    .add(`1o1-utils (${name})`, () => {
      times({ count, fn });
    })
    .add(`lodash (${name})`, () => {
      lodashTimes(count, fn);
    })
    .add(`Array.from (${name})`, () => {
      Array.from({ length: count }, (_, i) => fn(i));
    })
    .add(`native for-loop (${name})`, () => {
      const result: number[] = new Array(count);
      for (let i = 0; i < count; i++) {
        result[i] = fn(i);
      }
    });
}

export { bench };
