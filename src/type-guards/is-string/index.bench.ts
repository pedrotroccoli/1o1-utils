import lodashIsString from "lodash/isString.js";
import { Bench } from "tinybench";
import { isString } from "./index.js";

const cases: Array<{ name: string; value: unknown }> = [
  { name: "string", value: "hello" },
  { name: "empty-string", value: "" },
  { name: "number", value: 42 },
  { name: "object", value: { a: 1 } },
  { name: "null", value: null },
];

const bench = new Bench({ name: "isString", time: 1000 });

for (const { name, value } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      isString(value);
    })
    .add(`lodash (${name})`, () => {
      lodashIsString(value);
    })
    .add(`native (${name})`, () => {
      const _ = typeof value === "string";
      void _;
    });
}

export { bench };
