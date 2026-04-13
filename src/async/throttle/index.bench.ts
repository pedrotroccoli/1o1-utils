import lodashThrottle from "lodash/throttle.js";
import { Bench } from "tinybench";
import { throttle } from "./index.js";

const noop = () => {};

const bench = new Bench({ name: "throttle", time: 1000 });

bench
  .add("1o1-utils (creation)", () => {
    throttle({ fn: noop, ms: 100 });
  })
  .add("lodash (creation)", () => {
    lodashThrottle(noop, 100);
  });

const throttledOwn = throttle({ fn: noop, ms: 100_000 });
const throttledLodash = lodashThrottle(noop, 100_000);

bench
  .add("1o1-utils (invocation)", () => {
    throttledOwn();
  })
  .add("lodash (invocation)", () => {
    throttledLodash();
  });

export { bench };
