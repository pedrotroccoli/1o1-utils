import lodashDebounce from "lodash/debounce.js";
import { Bench } from "tinybench";
import { debounce } from "./index.js";

const noop = () => {};

const bench = new Bench({ name: "debounce", time: 1000 });

bench
  .add("1o1-utils (creation)", () => {
    debounce({ fn: noop, ms: 100 });
  })
  .add("lodash (creation)", () => {
    lodashDebounce(noop, 100);
  });

const debouncedOwn = debounce({ fn: noop, ms: 100_000 });
const debouncedLodash = lodashDebounce(noop, 100_000);

bench
  .add("1o1-utils (invocation)", () => {
    debouncedOwn();
  })
  .add("lodash (invocation)", () => {
    debouncedLodash();
  });

export { bench };
