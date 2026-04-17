import lodashDefaultsDeep from "lodash/defaultsDeep.js";
import { Bench } from "tinybench";
import { defaultsDeep } from "./index.js";

const smallTarget = { a: 1, b: "hello", c: true };
const smallSource = { b: "world", d: 42 };

const deepTarget = {
  user: {
    name: "Alice",
    settings: { theme: "dark", notifications: { email: true } },
    metadata: { created: "2024-01-01" },
  },
  config: { debug: false },
};

const deepSource = {
  user: {
    settings: { notifications: { sms: false, push: true }, lang: "pt" },
    metadata: { tags: ["beta"], updated: "2024-06-01" },
  },
  config: { version: "1.0", env: "prod" },
};

const bench = new Bench({ name: "defaultsDeep", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    defaultsDeep({ target: smallTarget, source: smallSource });
  })
  .add("lodash (small)", () => {
    lodashDefaultsDeep({}, smallTarget, smallSource);
  });

bench
  .add("1o1-utils (deep)", () => {
    defaultsDeep({ target: deepTarget, source: deepSource });
  })
  .add("lodash (deep)", () => {
    lodashDefaultsDeep({}, deepTarget, deepSource);
  });

export { bench };
