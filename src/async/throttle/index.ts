import type { Throttled, ThrottleParams } from "./types.js";

/**
 * Creates a throttled version of a function that executes at most once
 * every `ms` milliseconds.
 *
 * @param params - The parameters object
 * @param params.fn - The function to throttle
 * @param params.ms - Minimum interval between calls in milliseconds (non-negative)
 * @returns The throttled function with a `.cancel()` method
 *
 * @example
 * ```ts
 * const throttledFn = throttle({ fn: onScroll, ms: 100 });
 * window.addEventListener("scroll", throttledFn);
 * throttledFn.cancel(); // cancel pending trailing call
 * ```
 *
 * @throws Error if `fn` is not a function
 * @throws Error if `ms` is not a number or is negative
 */
function throttle<T extends (...args: unknown[]) => unknown>({
  fn,
  ms,
}: ThrottleParams<T>): Throttled<T> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("The 'ms' parameter must be a number");
  }

  if (ms < 0) {
    throw new Error("The 'ms' parameter must be a non-negative number");
  }

  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: unknown[] | undefined;
  let active = false;

  function throttled(...args: unknown[]) {
    const now = Date.now();

    if (!active || now - lastCallTime >= ms) {
      active = true;
      lastCallTime = now;
      fn(...args);
    } else {
      lastArgs = args;
      if (timeoutId === undefined) {
        timeoutId = setTimeout(
          () => {
            lastCallTime = Date.now();
            timeoutId = undefined;
            if (lastArgs !== undefined) {
              fn(...lastArgs);
              lastArgs = undefined;
            }
          },
          ms - (now - lastCallTime),
        );
      }
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastArgs = undefined;
    lastCallTime = 0;
    active = false;
  };

  return throttled as Throttled<T>;
}

export { throttle };
