import lodashOmitBy from "lodash/omitBy.js";
import { shake as radashShake } from "radash";
import { Bench } from "tinybench";
import { compact } from "./index.js";

const sampleObj = {
  id: "usr_00000001",
  name: "Alice",
  age: 30,
  role: "admin",
  department: "engineering",
  email: "alice@example.com",
  inactive: null,
  archived: null,
  deletedAt: undefined,
  notes: "",
  loginCount: 0,
};

const isFalsy = (v: unknown) => !v;

const bench = new Bench({ name: "compact", time: 1000 });

bench
  .add("1o1-utils", () => {
    compact({ obj: sampleObj });
  })
  .add("lodash (omitBy isFalsy)", () => {
    lodashOmitBy(sampleObj, isFalsy);
  })
  .add("radash (shake isFalsy)", () => {
    radashShake(sampleObj, isFalsy);
  });

export { bench };
