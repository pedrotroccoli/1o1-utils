import type { ClampParams, ClampResult } from "./types.js";

/**
 * Clamps a number to a given range.
 * Returns `min` if `value` is below the range, `max` if above, otherwise `value`.
 * If `min` is greater than `max`, the bounds are swapped automatically.
 *
 * @param params - The parameters object
 * @param params.value - The number to clamp
 * @param params.min - The lower bound (inclusive)
 * @param params.max - The upper bound (inclusive)
 * @returns The clamped number within `[min, max]`
 *
 * @example
 * ```ts
 * clamp({ value: 15, min: 0, max: 10 }); // 10
 * clamp({ value: -5, min: 0, max: 10 }); // 0
 * clamp({ value: 5, min: 0, max: 10 });  // 5
 * ```
 *
 * @keywords clamp, restrict, bound, constrain, limit, range
 *
 * @throws Error if `value`, `min`, or `max` is not a number or is `NaN`
 */
function clamp({ value, min, max }: ClampParams): ClampResult {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("The 'value' parameter must be a number");
  }
  if (typeof min !== "number" || Number.isNaN(min)) {
    throw new Error("The 'min' parameter must be a number");
  }
  if (typeof max !== "number" || Number.isNaN(max)) {
    throw new Error("The 'max' parameter must be a number");
  }

  const lower = min < max ? min : max;
  const upper = min < max ? max : min;

  if (value < lower) return lower;
  if (value > upper) return upper;
  return value;
}

export { clamp };
