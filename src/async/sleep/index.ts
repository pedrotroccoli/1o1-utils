import type { SleepParams } from "./types.js";

/**
 * Returns a promise that resolves after the specified delay.
 *
 * @param params - The parameters object
 * @param params.ms - Duration in milliseconds (non-negative)
 * @returns A promise that resolves after `ms` milliseconds
 *
 * @example
 * ```ts
 * await sleep({ ms: 1000 }); // waits 1 second
 * ```
 *
 * @throws Error if `ms` is not a number or is NaN
 * @throws Error if `ms` is negative
 */
function sleep({ ms }: SleepParams): Promise<void> {
  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("The 'ms' parameter must be a number");
  }

  if (ms < 0) {
    throw new Error("The 'ms' parameter must be a non-negative number");
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
