import lodashPick from "lodash/pick.js";
import { pick as radashPick } from "radash";
import { Bench } from "tinybench";
import { pick } from "./index.js";

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

const FLAT_KEYS = ["id", "name", "role"];
const NESTED_KEYS = ["id", "name", "address.city"];

const bench = new Bench({ name: "pick", time: 1000 });

// Flat keys
bench
  .add("1o1-utils (flat keys)", () => {
    pick({ obj: sampleObj, keys: FLAT_KEYS });
  })
  .add("lodash (flat keys)", () => {
    lodashPick(sampleObj, FLAT_KEYS);
  })
  .add("radash (flat keys)", () => {
    radashPick(sampleObj, FLAT_KEYS);
  })
  .add("native destructure (flat keys)", () => {
    const { id, name, role } = sampleObj;
    ({ id, name, role });
  });

// Nested keys (radash doesn't support dot notation)
bench
  .add("1o1-utils (nested keys)", () => {
    pick({ obj: sampleObj, keys: NESTED_KEYS });
  })
  .add("lodash (nested keys)", () => {
    lodashPick(sampleObj, NESTED_KEYS);
  });

export { bench };
