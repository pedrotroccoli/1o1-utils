import lodashClamp from "lodash/clamp.js";
import { Bench } from "tinybench";
import { clamp } from "./index.js";

const inside = { value: 50, min: 0, max: 100 };
const below = { value: -50, min: 0, max: 100 };
const above = { value: 150, min: 0, max: 100 };
const atMin = { value: 0, min: 0, max: 100 };
const atMax = { value: 100, min: 0, max: 100 };
const swapped = { value: 50, min: 100, max: 0 };

function nativeClamp(value: number, min: number, max: number): number {
  const lower = min < max ? min : max;
  const upper = min < max ? max : min;
  if (value < lower) return lower;
  if (value > upper) return upper;
  return value;
}

const bench = new Bench({ name: "clamp", time: 1000 });

bench
  .add("1o1-utils (inside)", () => {
    clamp(inside);
  })
  .add("lodash (inside)", () => {
    lodashClamp(inside.value, inside.min, inside.max);
  })
  .add("native (inside)", () => {
    nativeClamp(inside.value, inside.min, inside.max);
  });

bench
  .add("1o1-utils (below)", () => {
    clamp(below);
  })
  .add("lodash (below)", () => {
    lodashClamp(below.value, below.min, below.max);
  })
  .add("native (below)", () => {
    nativeClamp(below.value, below.min, below.max);
  });

bench
  .add("1o1-utils (above)", () => {
    clamp(above);
  })
  .add("lodash (above)", () => {
    lodashClamp(above.value, above.min, above.max);
  })
  .add("native (above)", () => {
    nativeClamp(above.value, above.min, above.max);
  });

bench
  .add("1o1-utils (at-min)", () => {
    clamp(atMin);
  })
  .add("lodash (at-min)", () => {
    lodashClamp(atMin.value, atMin.min, atMin.max);
  })
  .add("native (at-min)", () => {
    nativeClamp(atMin.value, atMin.min, atMin.max);
  });

bench
  .add("1o1-utils (at-max)", () => {
    clamp(atMax);
  })
  .add("lodash (at-max)", () => {
    lodashClamp(atMax.value, atMax.min, atMax.max);
  })
  .add("native (at-max)", () => {
    nativeClamp(atMax.value, atMax.min, atMax.max);
  });

bench
  .add("1o1-utils (swapped)", () => {
    clamp(swapped);
  })
  .add("lodash (swapped)", () => {
    lodashClamp(swapped.value, swapped.min, swapped.max);
  })
  .add("native (swapped)", () => {
    nativeClamp(swapped.value, swapped.min, swapped.max);
  });

export { bench };
