import lodashDefaults from "lodash/defaults.js";
import { Bench } from "tinybench";
import { defaults } from "./index.js";

const smallTarget = { a: 1, b: "hello", c: true };
const smallSource = { b: "world", d: 42, e: null };

const wideTarget: Record<string, unknown> = {};
const wideSource: Record<string, unknown> = {};
for (let i = 0; i < 50; i++) {
  if (i % 2 === 0) wideTarget[`k${i}`] = i;
  wideSource[`k${i}`] = `default-${i}`;
}

const bench = new Bench({ name: "defaults", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    defaults({ target: smallTarget, source: smallSource });
  })
  .add("lodash (small)", () => {
    lodashDefaults({}, smallTarget, smallSource);
  })
  .add("native (small)", () => {
    Object.assign({}, smallSource, smallTarget);
  });

bench
  .add("1o1-utils (wide)", () => {
    defaults({ target: wideTarget, source: wideSource });
  })
  .add("lodash (wide)", () => {
    lodashDefaults({}, wideTarget, wideSource);
  })
  .add("native (wide)", () => {
    Object.assign({}, wideSource, wideTarget);
  });

export { bench };
