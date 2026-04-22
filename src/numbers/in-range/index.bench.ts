import lodashInRange from "lodash/inRange.js";
import { inRange as radashInRange } from "radash";
import { Bench } from "tinybench";
import { inRange } from "./index.js";

const inside = { value: 50, start: 0, end: 100 };
const atStart = { value: 0, start: 0, end: 100 };
const atEnd = { value: 100, start: 0, end: 100 };
const outside = { value: 150, start: 0, end: 100 };
const swapped = { value: 50, start: 100, end: 0 };

function nativeInRange(value: number, start: number, end: number): boolean {
  const lower = start < end ? start : end;
  const upper = start < end ? end : start;
  return value >= lower && value < upper;
}

const bench = new Bench({ name: "inRange", time: 1000 });

bench
  .add("1o1-utils (inside)", () => {
    inRange(inside);
  })
  .add("lodash (inside)", () => {
    lodashInRange(inside.value, inside.start, inside.end);
  })
  .add("radash (inside)", () => {
    radashInRange(inside.value, inside.start, inside.end);
  })
  .add("native (inside)", () => {
    nativeInRange(inside.value, inside.start, inside.end);
  });

bench
  .add("1o1-utils (at-start)", () => {
    inRange(atStart);
  })
  .add("lodash (at-start)", () => {
    lodashInRange(atStart.value, atStart.start, atStart.end);
  })
  .add("radash (at-start)", () => {
    radashInRange(atStart.value, atStart.start, atStart.end);
  })
  .add("native (at-start)", () => {
    nativeInRange(atStart.value, atStart.start, atStart.end);
  });

bench
  .add("1o1-utils (at-end)", () => {
    inRange(atEnd);
  })
  .add("lodash (at-end)", () => {
    lodashInRange(atEnd.value, atEnd.start, atEnd.end);
  })
  .add("radash (at-end)", () => {
    radashInRange(atEnd.value, atEnd.start, atEnd.end);
  })
  .add("native (at-end)", () => {
    nativeInRange(atEnd.value, atEnd.start, atEnd.end);
  });

bench
  .add("1o1-utils (outside)", () => {
    inRange(outside);
  })
  .add("lodash (outside)", () => {
    lodashInRange(outside.value, outside.start, outside.end);
  })
  .add("radash (outside)", () => {
    radashInRange(outside.value, outside.start, outside.end);
  })
  .add("native (outside)", () => {
    nativeInRange(outside.value, outside.start, outside.end);
  });

bench
  .add("1o1-utils (swapped)", () => {
    inRange(swapped);
  })
  .add("lodash (swapped)", () => {
    lodashInRange(swapped.value, swapped.start, swapped.end);
  })
  .add("radash (swapped)", () => {
    radashInRange(swapped.value, swapped.start, swapped.end);
  })
  .add("native (swapped)", () => {
    nativeInRange(swapped.value, swapped.start, swapped.end);
  });

export { bench };
