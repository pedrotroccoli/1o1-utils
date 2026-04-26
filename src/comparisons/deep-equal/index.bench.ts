import lodashIsEqual from "lodash/isEqual.js";
import { Bench } from "tinybench";
import { deepEqual } from "./index.js";

const smallA = { x: 1, y: { n: 2 }, z: [1, 2, 3] };
const smallB = { x: 1, y: { n: 2 }, z: [1, 2, 3] };

const makeNested = (depth: number): Record<string, unknown> => {
  let node: Record<string, unknown> = { leaf: 42 };
  for (let i = 0; i < depth; i++) node = { i, child: node };
  return node;
};
const nestedA = makeNested(20);
const nestedB = makeNested(20);

const largeArrA = Array.from({ length: 100 }, (_, i) => ({ id: i, v: i * 2 }));
const largeArrB = Array.from({ length: 100 }, (_, i) => ({ id: i, v: i * 2 }));

const mismatchA = { x: 1, y: { n: 2 } };
const mismatchB = { x: 1, y: { n: 3 } };

const mapA = new Map<string, number>([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
const mapB = new Map<string, number>([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([5, 4, 3, 2, 1]);

const bench = new Bench({ name: "deepEqual", time: 1000 });

bench
  .add("1o1-utils (small nested object)", () => {
    deepEqual({ a: smallA, b: smallB });
  })
  .add("lodash (small nested object)", () => {
    lodashIsEqual(smallA, smallB);
  });

bench
  .add("1o1-utils (deeply nested object)", () => {
    deepEqual({ a: nestedA, b: nestedB });
  })
  .add("lodash (deeply nested object)", () => {
    lodashIsEqual(nestedA, nestedB);
  });

bench
  .add("1o1-utils (large array of objects)", () => {
    deepEqual({ a: largeArrA, b: largeArrB });
  })
  .add("lodash (large array of objects)", () => {
    lodashIsEqual(largeArrA, largeArrB);
  });

bench
  .add("1o1-utils (mismatch early)", () => {
    deepEqual({ a: mismatchA, b: mismatchB });
  })
  .add("lodash (mismatch early)", () => {
    lodashIsEqual(mismatchA, mismatchB);
  });

bench
  .add("1o1-utils (same ref)", () => {
    deepEqual({ a: nestedA, b: nestedA });
  })
  .add("lodash (same ref)", () => {
    lodashIsEqual(nestedA, nestedA);
  });

bench
  .add("1o1-utils (Map)", () => {
    deepEqual({ a: mapA, b: mapB });
  })
  .add("lodash (Map)", () => {
    lodashIsEqual(mapA, mapB);
  });

bench
  .add("1o1-utils (Set)", () => {
    deepEqual({ a: setA, b: setB });
  })
  .add("lodash (Set)", () => {
    lodashIsEqual(setA, setB);
  });

export { bench };
