import type { RandomIntParams, RandomIntResult } from "./types.js";

const TWO_POW_32 = 0x1_0000_0000;
const TWO_POW_53 = Number.MAX_SAFE_INTEGER + 1;
const TWO_POW_53_BIG = BigInt(TWO_POW_53);

/**
 * Generates a cryptographically-secure random integer in the inclusive range `[min, max]`.
 * Uses `crypto.getRandomValues` with rejection sampling — no modulo bias and no `Math.random`.
 * If `min` is greater than `max`, the bounds are swapped automatically.
 *
 * @param params - The parameters object
 * @param params.min - The lower bound (inclusive, must be a safe integer)
 * @param params.max - The upper bound (inclusive, must be a safe integer)
 * @returns A random integer in `[min, max]`
 *
 * @example
 * ```ts
 * randomInt({ min: 1, max: 10 });  // 7
 * randomInt({ min: 0, max: 100 }); // 42
 * randomInt({ min: 0, max: 1 });   // 0 or 1
 * ```
 *
 * @keywords random, integer, secure, crypto, range
 *
 * @throws Error if `min` or `max` is not a number, is `NaN`, or is not an integer
 * @throws Error if the range `max - min + 1` exceeds `2^53`
 */
function randomInt({ min, max }: RandomIntParams): RandomIntResult {
  if (typeof min !== "number" || Number.isNaN(min)) {
    throw new Error("The 'min' parameter must be a number");
  }
  if (typeof max !== "number" || Number.isNaN(max)) {
    throw new Error("The 'max' parameter must be a number");
  }
  if (!Number.isInteger(min)) {
    throw new Error("The 'min' parameter must be an integer");
  }
  if (!Number.isInteger(max)) {
    throw new Error("The 'max' parameter must be an integer");
  }

  const lower = min < max ? min : max;
  const upper = min < max ? max : min;

  const rangeBig = BigInt(upper) - BigInt(lower) + 1n;
  if (rangeBig > TWO_POW_53_BIG) {
    throw new Error("The range 'max - min + 1' must not exceed 2^53");
  }
  const range = Number(rangeBig);

  if (range === 1) return lower;

  if (range <= TWO_POW_32) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(TWO_POW_32 / range) * range;
    while (true) {
      crypto.getRandomValues(buf);
      const v = buf[0];
      if (v < limit) return lower + (v % range);
    }
  }

  const buf = new Uint32Array(2);
  const limit = Math.floor(TWO_POW_53 / range) * range;
  while (true) {
    crypto.getRandomValues(buf);
    const hi = buf[0] & 0x1f_ffff;
    const lo = buf[1];
    const sample = hi * TWO_POW_32 + lo;
    if (sample < limit) return lower + (sample % range);
  }
}

export { randomInt };
