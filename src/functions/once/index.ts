/**
 * Creates a version of a function that runs only once. Subsequent calls
 * return the cached result from the first invocation and ignore any new
 * arguments.
 *
 * @param fn - The function to wrap
 * @returns A wrapped function that executes `fn` at most once
 *
 * @example
 * ```ts
 * const init = once(() => ({ id: Math.random() }));
 * const a = init();
 * const b = init();
 * a === b; // true
 * ```
 *
 * @keywords run once, single call, memoize no args, lazy init, singleton
 *
 * @throws Error if `fn` is not a function
 *
 * @remarks
 * The reference to `fn` is released after the first call so it can be
 * garbage-collected. If `fn` throws on the first call, the exception
 * propagates and subsequent calls return `undefined` without retrying.
 */
function once<T extends (...args: never[]) => unknown>(fn: T): T {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  let target: T | undefined = fn;
  let result: unknown;

  return function (this: unknown) {
    if (target !== undefined) {
      const f = target;
      target = undefined;
      result = (f as unknown as (...a: unknown[]) => unknown).apply(
        this,
        // biome-ignore lint/complexity/noArguments: fast-path, avoids rest-params allocation
        arguments as unknown as unknown[],
      );
    }
    return result;
  } as unknown as T;
}

export { once };
