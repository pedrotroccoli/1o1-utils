import type { Throttled, ThrottleParams } from "./types.js";

function throttle<T extends (...args: unknown[]) => unknown>({
  fn,
  ms,
}: ThrottleParams<T>): Throttled<T> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (typeof ms !== "number" || ms !== ms || ms < 0) {
    throw new Error(
      ms !== ms || typeof ms !== "number"
        ? "The 'ms' parameter must be a number"
        : "The 'ms' parameter must be a non-negative number",
    );
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
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          timeoutId = undefined;
          if (lastArgs !== undefined) {
            fn(...lastArgs);
            lastArgs = undefined;
          }
        }, ms - (now - lastCallTime));
      }
    }
  }

  throttled.cancel = function () {
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
