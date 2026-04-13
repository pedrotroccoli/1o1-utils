import lodashMerge from "lodash/merge.js";
import { assign as radashAssign } from "radash";
import { Bench } from "tinybench";
import { deepMerge } from "./index.js";

const smallTarget = { a: 1, b: "hello", c: true };
const smallSource = { b: "world", d: 42 };

const deepTarget = {
  user: {
    name: "Alice",
    settings: { theme: "dark", notifications: { email: true, sms: false } },
    metadata: { created: "2024-01-01", tags: ["vip"] },
  },
  config: { debug: false, version: "1.0" },
};

const deepSource = {
  user: {
    settings: { notifications: { sms: true, push: true }, lang: "pt" },
    metadata: { tags: ["beta"], updated: "2024-06-01" },
  },
  config: { version: "2.0", env: "prod" },
};

const bench = new Bench({ name: "deepMerge", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    deepMerge({ target: smallTarget, source: smallSource });
  })
  .add("lodash (small)", () => {
    lodashMerge({}, smallTarget, smallSource);
  })
  .add("radash (small)", () => {
    radashAssign(smallTarget, smallSource);
  });

bench
  .add("1o1-utils (deep)", () => {
    deepMerge({ target: deepTarget, source: deepSource });
  })
  .add("lodash (deep)", () => {
    lodashMerge({}, deepTarget, deepSource);
  })
  .add("radash (deep)", () => {
    radashAssign(deepTarget, deepSource);
  });

export { bench };
