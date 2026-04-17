import lodashOnce from "lodash/once.js";
import { Bench } from "tinybench";
import { once } from "./index.js";

const noop = () => {};

const bench = new Bench({ name: "once", time: 1000 });

bench
  .add("1o1-utils (creation)", () => {
    once(noop);
  })
  .add("lodash (creation)", () => {
    lodashOnce(noop);
  });

const onceOwn = once(noop);
const onceLodash = lodashOnce(noop);

bench
  .add("1o1-utils (invocation)", () => {
    onceOwn();
  })
  .add("lodash (invocation)", () => {
    onceLodash();
  });

export { bench };
