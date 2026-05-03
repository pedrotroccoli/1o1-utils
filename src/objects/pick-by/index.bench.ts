import lodashPickBy from "lodash/pickBy.js";
import { shake as radashShake } from "radash";
import { Bench } from "tinybench";
import { pickBy } from "./index.js";

const sampleObj = {
  id: "usr_00000001",
  name: "Alice",
  age: 30,
  role: "admin",
  department: "engineering",
  email: "alice@example.com",
  inactive: null,
  archived: null,
};

const isNotNull = (v: unknown) => v !== null;

const bench = new Bench({ name: "pickBy", time: 1000 });

// radash.shake removes when filter returns true; invert to mimic pickBy semantics.
const isNullForShake = (v: unknown) => v === null;

bench
  .add("1o1-utils", () => {
    pickBy({ obj: sampleObj, predicate: isNotNull });
  })
  .add("lodash", () => {
    lodashPickBy(sampleObj, isNotNull);
  })
  .add("radash (shake, inverted)", () => {
    radashShake(sampleObj, isNullForShake);
  });

export { bench };
