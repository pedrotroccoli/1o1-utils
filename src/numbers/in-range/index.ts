import type { InRangeParams, InRangeResult } from "./types.js";

/**
 * Checks if a number falls within a given range.
 * Start is inclusive, end is exclusive. If `start` is greater than `end`,
 * the bounds are swapped automatically.
 *
 * @param params - The parameters object
 * @param params.value - The number to check
 * @param params.start - The start of the range (inclusive)
 * @param params.end - The end of the range (exclusive)
 * @returns `true` if `value` is within the range, `false` otherwise
 *
 * @example
 * ```ts
 * inRange({ value: 3, start: 1, end: 5 });  // true
 * inRange({ value: 5, start: 1, end: 5 });  // false (end exclusive)
 * inRange({ value: -1, start: -5, end: 5 }); // true
 * ```
 *
 * @keywords range, between, bounds, numeric check, clamp check
 *
 * @throws Error if `value`, `start`, or `end` is not a number or is `NaN`
 */
function inRange({ value, start, end }: InRangeParams): InRangeResult {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("The 'value' parameter must be a number");
  }
  if (typeof start !== "number" || Number.isNaN(start)) {
    throw new Error("The 'start' parameter must be a number");
  }
  if (typeof end !== "number" || Number.isNaN(end)) {
    throw new Error("The 'end' parameter must be a number");
  }

  const lower = start < end ? start : end;
  const upper = start < end ? end : start;

  return value >= lower && value < upper;
}

export { inRange };
