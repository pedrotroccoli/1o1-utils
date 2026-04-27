import type { SafelyResult } from "./types.js";

/**
 * Wraps a function so it returns a `[error, result]` tuple instead of throwing.
 * Auto-detects sync and async functions: sync calls return a tuple, async calls
 * return a `Promise` of a tuple. Anticipates the TC39 Safe Assignment Operator.
 *
 * On success the tuple is `[undefined, value]`. On error it is `[error, undefined]`.
 *
 * @param fn - The function to wrap
 * @returns A wrapped function that never throws (sync) or rejects (async)
 *
 * @example
 * ```ts
 * const [err, data] = safely(JSON.parse)("{invalid");
 * if (err) console.error(err);
 * else console.log(data);
 *
 * const [fetchErr, user] = await safely(fetchUser)(userId);
 * ```
 *
 * @keywords try catch tuple, go-style errors, safe assignment, error handling, tryit
 *
 * @throws Error if `fn` is not a function
 */
function safely<A extends unknown[], T>(
  fn: (...args: A) => Promise<T>,
): (...args: A) => Promise<SafelyResult<T>>;
function safely<A extends unknown[], T>(
  fn: (...args: A) => T,
): (...args: A) => SafelyResult<T>;
function safely<A extends unknown[], T>(
  fn: (...args: A) => T | Promise<T>,
): (...args: A) => SafelyResult<T> | Promise<SafelyResult<T>> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  return (...args: A): SafelyResult<T> | Promise<SafelyResult<T>> => {
    try {
      const result = fn(...args);
      if (
        result !== null &&
        typeof result === "object" &&
        typeof (result as { then?: unknown }).then === "function"
      ) {
        return Promise.resolve(result as Promise<T>).then(
          (value): SafelyResult<T> => [undefined, value],
          (error: unknown): SafelyResult<T> => [error, undefined],
        );
      }
      return [undefined, result as T];
    } catch (error) {
      return [error, undefined];
    }
  };
}

export { safely };
