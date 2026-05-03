import lodashPickBy from "lodash/pickBy.js";
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

bench
  .add("1o1-utils", () => {
    pickBy({ obj: sampleObj, predicate: isNotNull });
  })
  .add("lodash", () => {
    lodashPickBy(sampleObj, isNotNull);
  });

export { bench };
