import lodashIsEmpty from "lodash/isEmpty.js";
import { isEmpty as radashIsEmpty } from "radash";
import { Bench } from "tinybench";
import { isEmpty } from "./index.js";

const emptyObj = {};
const filledObj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
};
const emptyArr: unknown[] = [];
const filledArr = Array.from({ length: 100 }, (_, i) => i);

const bench = new Bench({ name: "isEmpty", time: 1000 });

bench
  .add("1o1-utils (empty object)", () => {
    isEmpty({ value: emptyObj });
  })
  .add("lodash (empty object)", () => {
    lodashIsEmpty(emptyObj);
  })
  .add("radash (empty object)", () => {
    radashIsEmpty(emptyObj);
  });

bench
  .add("1o1-utils (filled object)", () => {
    isEmpty({ value: filledObj });
  })
  .add("lodash (filled object)", () => {
    lodashIsEmpty(filledObj);
  })
  .add("radash (filled object)", () => {
    radashIsEmpty(filledObj);
  });

bench
  .add("1o1-utils (empty array)", () => {
    isEmpty({ value: emptyArr });
  })
  .add("lodash (empty array)", () => {
    lodashIsEmpty(emptyArr);
  })
  .add("radash (empty array)", () => {
    radashIsEmpty(emptyArr);
  });

bench
  .add("1o1-utils (filled array)", () => {
    isEmpty({ value: filledArr });
  })
  .add("lodash (filled array)", () => {
    lodashIsEmpty(filledArr);
  })
  .add("radash (filled array)", () => {
    radashIsEmpty(filledArr);
  });

bench
  .add("1o1-utils (null)", () => {
    isEmpty({ value: null });
  })
  .add("lodash (null)", () => {
    lodashIsEmpty(null);
  })
  .add("radash (null)", () => {
    radashIsEmpty(null);
  });

export { bench };
