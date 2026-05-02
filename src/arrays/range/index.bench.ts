import lodashRange from "lodash/range.js";
import { list as radashList } from "radash";
import { Bench } from "tinybench";
import { range } from "./index.js";

const sizes = [
  { name: "n=10", end: 10 },
  { name: "n=1k", end: 1_000 },
  { name: "n=100k", end: 100_000 },
  { name: "n=1M", end: 1_000_000 },
];

const bench = new Bench({ name: "range", time: 1000 });

for (const { name, end } of sizes) {
  bench
    .add(`1o1-utils (${name})`, () => {
      range({ end });
    })
    .add(`lodash (${name})`, () => {
      lodashRange(0, end);
    })
    .add(`radash list (${name})`, () => {
      radashList(0, end - 1);
    })
    .add(`native for-loop (${name})`, () => {
      const result: number[] = new Array(end);
      for (let i = 0; i < end; i++) result[i] = i;
    });
}

bench
  .add("1o1-utils (step=2, n=100k)", () => {
    range({ start: 0, end: 100_000, step: 2 });
  })
  .add("lodash (step=2, n=100k)", () => {
    lodashRange(0, 100_000, 2);
  });

bench
  .add("1o1-utils (reverse, n=100k)", () => {
    range({ start: 100_000, end: 0, step: -1 });
  })
  .add("lodash (reverse, n=100k)", () => {
    lodashRange(100_000, 0, -1);
  });

export { bench };
