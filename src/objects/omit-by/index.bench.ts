import lodashOmitBy from "lodash/omitBy.js";
import { Bench } from "tinybench";
import { omitBy } from "./index.js";

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

const isNull = (v: unknown) => v === null;

const bench = new Bench({ name: "omitBy", time: 1000 });

bench
  .add("1o1-utils", () => {
    omitBy({ obj: sampleObj, predicate: isNull });
  })
  .add("lodash", () => {
    lodashOmitBy(sampleObj, isNull);
  });

export { bench };
