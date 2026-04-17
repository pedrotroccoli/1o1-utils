import lodashSet from "lodash/set.js";
import { set as radashSet } from "radash";
import { Bench } from "tinybench";
import { set } from "./index.js";

function makeSample() {
  return {
    id: "usr_00000001",
    name: "Alice",
    address: { city: "New York", zip: "10001", geo: { lat: 40.7, lng: -74 } },
    metadata: { created: "2024-01-01", tags: ["vip", "beta"] },
  };
}

const bench = new Bench({ name: "set", time: 1000 });

bench
  .add("1o1-utils (shallow)", () => {
    set({ obj: makeSample(), path: "name", value: "Bob" });
  })
  .add("lodash (shallow, mutating)", () => {
    lodashSet(makeSample(), "name", "Bob");
  })
  .add("radash (shallow)", () => {
    radashSet(makeSample(), "name", "Bob");
  });

bench
  .add("1o1-utils (deep)", () => {
    set({ obj: makeSample(), path: "address.geo.lat", value: 0 });
  })
  .add("lodash (deep, mutating)", () => {
    lodashSet(makeSample(), "address.geo.lat", 0);
  })
  .add("radash (deep)", () => {
    radashSet(makeSample(), "address.geo.lat", 0);
  });

bench
  .add("1o1-utils (create path)", () => {
    set({ obj: {}, path: "a.b.c.d.e", value: 1 });
  })
  .add("lodash (create path, mutating)", () => {
    lodashSet({}, "a.b.c.d.e", 1);
  });

export { bench };
