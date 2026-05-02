import type { RangeParams, RangeResult } from "./types.js";

/**
 * Generates an array of numbers from `start` (inclusive) to `end` (exclusive),
 * incrementing by `step`.
 *
 * If `step` is omitted, it defaults to `1` when `start <= end` and `-1` when
 * `start > end`. If the sign of `step` does not move from `start` toward `end`,
 * an empty array is returned.
 *
 * @param params - The parameters object
 * @param params.start - The starting value of the sequence (default `0`)
 * @param params.end - The end value of the sequence (exclusive)
 * @param params.step - The increment between values (default `1` or `-1`)
 * @returns An array of numbers from `start` to `end` stepping by `step`
 *
 * @example
 * ```ts
 * range({ end: 5 });                       // [0, 1, 2, 3, 4]
 * range({ start: 1, end: 5 });             // [1, 2, 3, 4]
 * range({ start: 0, end: 10, step: 2 });   // [0, 2, 4, 6, 8]
 * range({ start: 5, end: 0, step: -1 });   // [5, 4, 3, 2, 1]
 * range({ start: 5, end: 0 });             // [5, 4, 3, 2, 1]
 * ```
 *
 * @keywords range, sequence, list, numbers, interval, arange
 *
 * @throws Error if `start`, `end`, or `step` is not a number or is `NaN`
 * @throws Error if `step` is `0`
 */
function range({ start = 0, end, step }: RangeParams): RangeResult {
  if (typeof start !== "number" || Number.isNaN(start)) {
    throw new Error("The 'start' parameter must be a number");
  }
  if (typeof end !== "number" || Number.isNaN(end)) {
    throw new Error("The 'end' parameter must be a number");
  }
  if (step !== undefined && (typeof step !== "number" || Number.isNaN(step))) {
    throw new Error("The 'step' parameter must be a number");
  }
  if (step === 0) {
    throw new Error("The 'step' parameter cannot be 0");
  }

  const s = step ?? (start > end ? -1 : 1);
  const len = Math.max(0, Math.ceil((end - start) / s));
  const result: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = start + i * s;
  }
  return result;
}

export { range };
