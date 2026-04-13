import type { Debounced, DebounceParams } from "./types.js";

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
