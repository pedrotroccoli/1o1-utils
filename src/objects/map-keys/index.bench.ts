import lodashMapKeys from "lodash/mapKeys.js";
import { Bench } from "tinybench";
import { mapKeys } from "./index.js";

const small: Record<string, number> = { a: 1, b: 2, c: 3 };

const wide: Record<string, number> = {};
for (let i = 0; i < 50; i++) {
  wide[`k${i}`] = i;
}

const upper = (_value: unknown, key: string) => key.toUpperCase();

const bench = new Bench({ name: "mapKeys", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    mapKeys({ obj: small, iteratee: upper });
  })
  .add("lodash (small)", () => {
    lodashMapKeys(small, (_value, key) => key.toUpperCase());
  })
  .add("native (small)", () => {
    Object.fromEntries(
      Object.entries(small).map(([k, v]) => [k.toUpperCase(), v]),
    );
  });

bench
  .add("1o1-utils (wide)", () => {
    mapKeys({ obj: wide, iteratee: upper });
  })
  .add("lodash (wide)", () => {
    lodashMapKeys(wide, (_value, key) => key.toUpperCase());
  })
  .add("native (wide)", () => {
    Object.fromEntries(
      Object.entries(wide).map(([k, v]) => [k.toUpperCase(), v]),
    );
  });

export { bench };
