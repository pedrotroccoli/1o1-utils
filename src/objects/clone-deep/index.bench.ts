import lodashCloneDeep from "lodash/cloneDeep.js";
import { clone as radashClone } from "radash";
import { Bench } from "tinybench";
import { cloneDeep } from "./index.js";

const small = { a: 1, b: "hello", c: true, d: null };

const deep = {
  user: {
    name: "Alice",
    settings: {
      theme: "dark",
      notifications: { email: true, sms: false, push: { enabled: true } },
    },
    metadata: { created: "2024-01-01", tags: ["vip", "beta"] },
  },
  config: { debug: false, version: "1.0", features: { a: true, b: false } },
};

const mixed = {
  date: new Date("2024-06-01"),
  pattern: /test/gi,
  map: new Map<string, unknown>([
    ["a", { nested: [1, 2] }],
    ["b", new Set([3, 4, 5])],
  ]),
  set: new Set([{ x: 1 }, { y: 2 }]),
  buffer: new Uint8Array([10, 20, 30]),
  nested: { deep: { value: 42 } },
};

const array1k = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `item-${i}`,
  active: i % 2 === 0,
}));

const bench = new Bench({ name: "cloneDeep", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    cloneDeep({ value: small });
  })
  .add("lodash (small)", () => {
    lodashCloneDeep(small);
  })
  .add("radash (small)", () => {
    radashClone(small);
  })
  .add("structuredClone (small)", () => {
    structuredClone(small);
  });

bench
  .add("1o1-utils (deep)", () => {
    cloneDeep({ value: deep });
  })
  .add("lodash (deep)", () => {
    lodashCloneDeep(deep);
  })
  .add("radash (deep)", () => {
    radashClone(deep);
  })
  .add("structuredClone (deep)", () => {
    structuredClone(deep);
  });

bench
  .add("1o1-utils (mixed)", () => {
    cloneDeep({ value: mixed });
  })
  .add("lodash (mixed)", () => {
    lodashCloneDeep(mixed);
  })
  .add("structuredClone (mixed)", () => {
    structuredClone(mixed);
  });

bench
  .add("1o1-utils (array-1k)", () => {
    cloneDeep({ value: array1k });
  })
  .add("lodash (array-1k)", () => {
    lodashCloneDeep(array1k);
  })
  .add("radash (array-1k)", () => {
    radashClone(array1k);
  })
  .add("structuredClone (array-1k)", () => {
    structuredClone(array1k);
  });

export { bench };
