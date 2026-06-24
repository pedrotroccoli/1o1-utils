import lodashIsNumber from "lodash/isNumber.js";
import { Bench } from "tinybench";
import { isNumber } from "./index.js";

const cases: Array<{ name: string; value: unknown }> = [
  { name: "integer", value: 42 },
  { name: "float", value: 3.14 },
  { name: "NaN", value: Number.NaN },
  { name: "string", value: "42" },
  { name: "null", value: null },
];

const bench = new Bench({ name: "isNumber", time: 1000 });

for (const { name, value } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      isNumber(value);
    })
    .add(`lodash (${name})`, () => {
      lodashIsNumber(value);
    })
    .add(`native (${name})`, () => {
      const _ = typeof value === "number";
      void _;
    });
}

export { bench };
