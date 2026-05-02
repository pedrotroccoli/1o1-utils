import lodashRandom from "lodash/random.js";
import { Bench } from "tinybench";
import { randomInt } from "./index.js";

const small = { min: 1, max: 10 };
const medium = { min: 0, max: 1_000_000 };
const wide = { min: 0, max: 2 ** 40 };
const atBound = { min: 5, max: 5 };

function nativeRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bench = new Bench({ name: "randomInt", time: 1000 });

bench
  .add("1o1-utils (small)", () => {
    randomInt(small);
  })
  .add("lodash (small)", () => {
    lodashRandom(small.min, small.max);
  })
  .add("native Math.random (small)", () => {
    nativeRandomInt(small.min, small.max);
  });

bench
  .add("1o1-utils (medium)", () => {
    randomInt(medium);
  })
  .add("lodash (medium)", () => {
    lodashRandom(medium.min, medium.max);
  })
  .add("native Math.random (medium)", () => {
    nativeRandomInt(medium.min, medium.max);
  });

bench
  .add("1o1-utils (wide)", () => {
    randomInt(wide);
  })
  .add("lodash (wide)", () => {
    lodashRandom(wide.min, wide.max);
  })
  .add("native Math.random (wide)", () => {
    nativeRandomInt(wide.min, wide.max);
  });

bench
  .add("1o1-utils (at-bound)", () => {
    randomInt(atBound);
  })
  .add("lodash (at-bound)", () => {
    lodashRandom(atBound.min, atBound.max);
  })
  .add("native Math.random (at-bound)", () => {
    nativeRandomInt(atBound.min, atBound.max);
  });

export { bench };
