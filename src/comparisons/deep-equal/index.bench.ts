import { dequal } from "dequal";
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
    deepEqual(smallA, smallB);
  })
  .add("lodash (small nested object)", () => {
    lodashIsEqual(smallA, smallB);
  })
  .add("dequal (small nested object)", () => {
    dequal(smallA, smallB);
  });

bench
  .add("1o1-utils (deeply nested object)", () => {
    deepEqual(nestedA, nestedB);
  })
  .add("lodash (deeply nested object)", () => {
    lodashIsEqual(nestedA, nestedB);
  })
  .add("dequal (deeply nested object)", () => {
    dequal(nestedA, nestedB);
  });

bench
  .add("1o1-utils (large array of objects)", () => {
    deepEqual(largeArrA, largeArrB);
  })
  .add("lodash (large array of objects)", () => {
    lodashIsEqual(largeArrA, largeArrB);
  })
  .add("dequal (large array of objects)", () => {
    dequal(largeArrA, largeArrB);
  });

bench
  .add("1o1-utils (mismatch early)", () => {
    deepEqual(mismatchA, mismatchB);
  })
  .add("lodash (mismatch early)", () => {
    lodashIsEqual(mismatchA, mismatchB);
  })
  .add("dequal (mismatch early)", () => {
    dequal(mismatchA, mismatchB);
  });

bench
  .add("1o1-utils (same ref)", () => {
    deepEqual(nestedA, nestedA);
  })
  .add("lodash (same ref)", () => {
    lodashIsEqual(nestedA, nestedA);
  })
  .add("dequal (same ref)", () => {
    dequal(nestedA, nestedA);
  });

bench
  .add("1o1-utils (Map)", () => {
    deepEqual(mapA, mapB);
  })
  .add("lodash (Map)", () => {
    lodashIsEqual(mapA, mapB);
  })
  .add("dequal (Map)", () => {
    dequal(mapA, mapB);
  });

bench
  .add("1o1-utils (Set)", () => {
    deepEqual(setA, setB);
  })
  .add("lodash (Set)", () => {
    lodashIsEqual(setA, setB);
  })
  .add("dequal (Set)", () => {
    dequal(setA, setB);
  });

export { bench };
