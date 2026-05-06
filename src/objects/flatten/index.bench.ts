import lodashFlattenDeep from "lodash/flattenDeep.js";
import { crush as radashCrush } from "radash";
import { Bench } from "tinybench";
import { flatten } from "./index.js";

const sampleArray = [
  1,
  [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]],
  [11, 12, [13, [14, 15]]],
  16,
];

const sampleObject = {
  id: "usr_00000001",
  name: "Alice",
  profile: {
    age: 30,
    role: "admin",
    address: {
      city: "New York",
      zip: "10001",
      coords: { lat: 40.7128, lng: -74.006 },
    },
  },
  settings: {
    theme: "dark",
    notifications: { email: true, sms: false },
  },
};

const bench = new Bench({ name: "flatten", time: 1000 });

bench
  .add("1o1-utils (deep array)", () => {
    flatten({ value: sampleArray });
  })
  .add("native (deep array)", () => {
    sampleArray.flat(Number.POSITIVE_INFINITY);
  })
  .add("lodash (deep array)", () => {
    lodashFlattenDeep(sampleArray);
  });

bench
  .add("1o1-utils (nested object)", () => {
    flatten({ value: sampleObject });
  })
  .add("radash (nested object)", () => {
    radashCrush(sampleObject);
  });

export { bench };
