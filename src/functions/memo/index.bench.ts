import lodashMemoize from "lodash/memoize.js";
import { Bench } from "tinybench";
import { memo } from "./index.js";

const compute = (n: number) => n * 2;

const bench = new Bench({ name: "memo", time: 1000 });

bench
  .add("1o1-utils (creation)", () => {
    memo({ fn: compute });
  })
  .add("lodash (creation)", () => {
    lodashMemoize(compute);
  });

const memoOwn = memo({ fn: compute });
const memoLodash = lodashMemoize(compute);
memoOwn(1);
memoLodash(1);

bench
  .add("1o1-utils (invocation, hit)", () => {
    memoOwn(1);
  })
  .add("lodash (invocation, hit)", () => {
    memoLodash(1);
  });

let i = 0;
const memoOwnMiss = memo({ fn: compute });
const memoLodashMiss = lodashMemoize(compute);

bench
  .add("1o1-utils (invocation, miss)", () => {
    memoOwnMiss(i++);
  })
  .add("lodash (invocation, miss)", () => {
    memoLodashMiss(i++);
  });

export { bench };
