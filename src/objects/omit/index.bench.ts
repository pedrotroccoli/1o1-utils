import lodashOmit from "lodash/omit.js";
import { omit as radashOmit } from "radash";
import { Bench } from "tinybench";
import { omit } from "./index.js";

const sampleObj = {
  id: "usr_00000001",
  name: "Alice",
  age: 30,
  role: "admin",
  department: "engineering",
  email: "alice@example.com",
  address: { city: "New York", zip: "10001" },
  metadata: { created: "2024-01-01", tags: ["vip", "beta"] },
};

const FLAT_KEYS = ["age", "email", "department"];
const NESTED_KEYS = ["age", "address.zip", "metadata.tags"];

const bench = new Bench({ name: "omit", time: 1000 });

// Flat keys
bench
  .add("1o1-utils (flat keys)", () => {
    omit({ obj: sampleObj, keys: FLAT_KEYS });
  })
  .add("lodash (flat keys)", () => {
    lodashOmit(sampleObj, FLAT_KEYS);
  })
  .add("radash (flat keys)", () => {
    radashOmit(sampleObj, FLAT_KEYS);
  });

// Nested keys (radash doesn't support dot notation)
bench
  .add("1o1-utils (nested keys)", () => {
    omit({ obj: sampleObj, keys: NESTED_KEYS });
  })
  .add("lodash (nested keys)", () => {
    lodashOmit(sampleObj, NESTED_KEYS);
  });

export { bench };
