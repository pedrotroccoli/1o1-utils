import type { Debounced, DebounceParams } from "./types.js";

/**
 * Creates a debounced version of a function that delays invocation until
 * after `ms` milliseconds have elapsed since the last call.
 *
 * @param params - The parameters object
 * @param params.fn - The function to debounce
 * @param params.ms - Delay in milliseconds (non-negative)
 * @returns The debounced function with a `.cancel()` method
 *
 * @example
 * ```ts
 * const debouncedFn = debounce({ fn: search, ms: 300 });
 * debouncedFn("query");
 * debouncedFn.cancel(); // cancel pending call
 * ```
 *
 * @keywords delay call, wait idle, input delay, search delay
 *
 * @throws Error if `fn` is not a function
 * @throws Error if `ms` is not a number or is negative
 */
function debounce<T extends (...args: unknown[]) => unknown>({
  fn,
  ms,
}: DebounceParams<T>): Debounced<T> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("The 'ms' parameter must be a number");
  }

  if (ms < 0) {
    throw new Error("The 'ms' parameter must be a non-negative number");
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function debounced(...args: unknown[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn(...args);
    }, ms);
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced as Debounced<T>;
}

export { debounce };
