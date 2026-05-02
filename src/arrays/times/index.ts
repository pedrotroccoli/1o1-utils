import type { TimesParams, TimesResult } from "./types.js";

/**
 * Invokes `fn` `count` times and returns an array of the results.
 * The function receives the current index (0-based) on each call.
 *
 * @param params - The parameters object
 * @param params.count - The number of times to invoke `fn` (non-negative integer)
 * @param params.fn - The function to invoke; receives the current index
 * @returns An array of length `count` containing the results of each invocation
 *
 * @example
 * ```ts
 * times({ count: 3, fn: (i) => i * 2 });
 * // => [0, 2, 4]
 *
 * times({ count: 5, fn: () => Math.random() });
 * // => [0.42, 0.91, 0.13, 0.77, 0.05]
 *
 * times({ count: 0, fn: (i) => i });
 * // => []
 * ```
 *
 * @keywords times, repeat, range, fill, generate, invoke
 *
 * @throws Error if `count` is not a number, is `NaN`, is not an integer, or is negative
 * @throws Error if `fn` is not a function
 */
function times<T>({ count, fn }: TimesParams<T>): TimesResult<T> {
  if (typeof count !== "number" || Number.isNaN(count)) {
    throw new Error("The 'count' parameter must be a number");
  }
  if (!Number.isInteger(count)) {
    throw new Error("The 'count' parameter must be an integer");
  }
  if (count < 0) {
    throw new Error("The 'count' parameter must be non-negative");
  }
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  const result: T[] = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = fn(i);
  }
  return result;
}

export { times };
