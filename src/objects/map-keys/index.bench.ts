import lodashMapKeys from "lodash/mapKeys.js";
import { Bench } from "tinybench";
import { mapKeys } from "./index.js";

const small: Record<string, number> = { a: 1, b: 2, c: 3 };

const wide: Record<string, number> = {};
for (let i = 0; i < 50; i++) {
  wide[`k${i}`] = i;
}

const upper = (_value: unknown, key: string) => key.toUpperCase();
const upperEntry = ([k, v]: [string, unknown]): [string, unknown] => [
  k.toUpperCase(),
  v,
];

const bench = new Bench({ name: "mapKeys", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    mapKeys({ obj: small, iteratee: upper });
  })
  .add("lodash (small)", () => {
    lodashMapKeys(small, upper);
  })
  .add("native (small)", () => {
    Object.fromEntries(Object.entries(small).map(upperEntry));
  });

bench
  .add("1o1-utils (wide)", () => {
    mapKeys({ obj: wide, iteratee: upper });
  })
  .add("lodash (wide)", () => {
    lodashMapKeys(wide, upper);
  })
  .add("native (wide)", () => {
    Object.fromEntries(Object.entries(wide).map(upperEntry));
  });

export { bench };
