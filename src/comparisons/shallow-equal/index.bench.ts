import lodashIsEqual from "lodash/isEqual.js";
import { Bench } from "tinybench";
import { shallowEqual } from "./index.js";

function manualShallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) =>
    Object.is(
      (a as Record<string, unknown>)[k],
      (b as Record<string, unknown>)[k],
    ),
  );
}

const smallObjA = { x: 1, y: 2, z: 3 };
const smallObjB = { x: 1, y: 2, z: 3 };

const makeLargeObj = (): Record<string, number> => {
  const obj: Record<string, number> = {};
  for (let i = 0; i < 50; i++) obj[`k${i}`] = i;
  return obj;
};
const largeObjA = makeLargeObj();
const largeObjB = makeLargeObj();

const arrA = Array.from({ length: 100 }, (_, i) => i);
const arrB = Array.from({ length: 100 }, (_, i) => i);

const mismatchA = { x: 1, y: 2, z: 3 };
const mismatchB = { x: 1, y: 2, z: 4 };

const bench = new Bench({ name: "shallowEqual", time: 1000 });

bench
  .add("1o1-utils (equal small object)", () => {
    shallowEqual({ a: smallObjA, b: smallObjB });
  })
  .add("lodash (equal small object)", () => {
    lodashIsEqual(smallObjA, smallObjB);
  })
  .add("native (equal small object)", () => {
    manualShallowEqual(smallObjA, smallObjB);
  });

bench
  .add("1o1-utils (equal large object)", () => {
    shallowEqual({ a: largeObjA, b: largeObjB });
  })
  .add("lodash (equal large object)", () => {
    lodashIsEqual(largeObjA, largeObjB);
  })
  .add("native (equal large object)", () => {
    manualShallowEqual(largeObjA, largeObjB);
  });

bench
  .add("1o1-utils (equal array)", () => {
    shallowEqual({ a: arrA, b: arrB });
  })
  .add("lodash (equal array)", () => {
    lodashIsEqual(arrA, arrB);
  })
  .add("native (equal array)", () => {
    manualShallowEqual(arrA, arrB);
  });

bench
  .add("1o1-utils (mismatch)", () => {
    shallowEqual({ a: mismatchA, b: mismatchB });
  })
  .add("lodash (mismatch)", () => {
    lodashIsEqual(mismatchA, mismatchB);
  })
  .add("native (mismatch)", () => {
    manualShallowEqual(mismatchA, mismatchB);
  });

bench
  .add("1o1-utils (same ref)", () => {
    shallowEqual({ a: largeObjA, b: largeObjA });
  })
  .add("lodash (same ref)", () => {
    lodashIsEqual(largeObjA, largeObjA);
  })
  .add("native (same ref)", () => {
    manualShallowEqual(largeObjA, largeObjA);
  });

export { bench };
