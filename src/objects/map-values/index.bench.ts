import lodashMapValues from "lodash/mapValues.js";
import { Bench } from "tinybench";
import { mapValues } from "./index.js";

const small: Record<string, number> = { a: 1, b: 2, c: 3 };

const wide: Record<string, number> = {};
for (let i = 0; i < 50; i++) {
  wide[`k${i}`] = i;
}

const double = (value: unknown) => (value as number) * 2;
const doubleEntry = ([k, v]: [string, unknown]): [string, number] => [
  k,
  (v as number) * 2,
];

const bench = new Bench({ name: "mapValues", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    mapValues({ obj: small, iteratee: double });
  })
  .add("lodash (small)", () => {
    lodashMapValues(small, double);
  })
  .add("native (small)", () => {
    Object.fromEntries(Object.entries(small).map(doubleEntry));
  });

bench
  .add("1o1-utils (wide)", () => {
    mapValues({ obj: wide, iteratee: double });
  })
  .add("lodash (wide)", () => {
    lodashMapValues(wide, double);
  })
  .add("native (wide)", () => {
    Object.fromEntries(Object.entries(wide).map(doubleEntry));
  });

export { bench };
