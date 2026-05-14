import lodashIsNil from "lodash/isNil.js";
import { Bench } from "tinybench";
import { isNullish } from "./index.js";

const cases: Array<{ name: string; value: unknown }> = [
  { name: "null", value: null },
  { name: "undefined", value: undefined },
  { name: "number", value: 0 },
  { name: "string", value: "" },
  { name: "object", value: { a: 1 } },
];

const bench = new Bench({ name: "isNullish", time: 1000 });

for (const { name, value } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      isNullish(value);
    })
    .add(`lodash (${name})`, () => {
      lodashIsNil(value);
    })
    .add(`native (${name})`, () => {
      const _ = value === null || value === undefined;
      void _;
    });
}

export { bench };
