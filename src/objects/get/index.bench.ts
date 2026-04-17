import lodashGet from "lodash/get.js";
import { get as radashGet } from "radash";
import { Bench } from "tinybench";
import { get } from "./index.js";

const sampleObj = {
  id: "usr_00000001",
  name: "Alice",
  address: { city: "New York", zip: "10001", geo: { lat: 40.7, lng: -74 } },
  metadata: { created: "2024-01-01", tags: ["vip", "beta"] },
};

const bench = new Bench({ name: "get", time: 1000 });

bench
  .add("1o1-utils (shallow)", () => {
    get({ obj: sampleObj, path: "name" });
  })
  .add("lodash (shallow)", () => {
    lodashGet(sampleObj, "name");
  })
  .add("radash (shallow)", () => {
    radashGet(sampleObj, "name");
  })
  .add("native (shallow)", () => {
    // biome-ignore lint/complexity/useLiteralKeys: parity with dynamic access
    const _ = sampleObj["name"];
    return _;
  });

bench
  .add("1o1-utils (deep)", () => {
    get({ obj: sampleObj, path: "address.geo.lat" });
  })
  .add("lodash (deep)", () => {
    lodashGet(sampleObj, "address.geo.lat");
  })
  .add("radash (deep)", () => {
    radashGet(sampleObj, "address.geo.lat");
  })
  .add("native (deep)", () => {
    const _ = sampleObj?.address?.geo?.lat;
    return _;
  });

bench
  .add("1o1-utils (missing + default)", () => {
    get({ obj: sampleObj, path: "address.country", defaultValue: "BR" });
  })
  .add("lodash (missing + default)", () => {
    lodashGet(sampleObj, "address.country", "BR");
  });

export { bench };
