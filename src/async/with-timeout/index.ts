import type { WithTimeoutParams } from "./types.js";

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Wraps a promise with a timeout. Rejects with a TimeoutError if the promise
 * does not settle within the given duration. Accepts an optional AbortSignal
 * to cancel externally.
 *
 * @param params - The parameters object
 * @param params.promise - The promise to race against the timeout
 * @param params.ms - Timeout duration in milliseconds (non-negative)
 * @param params.message - Error message or lazy factory (default: `Operation timed out after {ms}ms`)
 * @param params.signal - Optional AbortSignal; rejects with `signal.reason` when aborted
 * @returns A promise that resolves with the original value or rejects with TimeoutError
 *
 * @example
 * ```ts
 * await withTimeout({ promise: fetchData(), ms: 5000 });
 * // resolves normally if < 5s, throws TimeoutError otherwise
 *
 * await withTimeout({ promise: slowApi(), ms: 3000, message: "API too slow" });
 * ```
 *
 * @keywords promise timeout, race timeout, abort promise, deadline, time limit
 *
 * @throws Error if `promise` is not thenable
 * @throws Error if `ms` is not a non-negative number
 * @throws Error if `signal` is not an AbortSignal
 * @throws TimeoutError if `ms` elapses before the promise settles
 */
function withTimeout<T>({
  promise,
  ms,
  message,
  signal,
}: WithTimeoutParams<T>): Promise<T> {
  if (
    promise === null ||
    promise === undefined ||
    typeof (promise as { then?: unknown }).then !== "function"
  ) {
    throw new Error("The 'promise' parameter must be a Promise");
  }

  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("The 'ms' parameter must be a number");
  }

  if (ms < 0) {
    throw new Error("The 'ms' parameter must be a non-negative number");
  }

  if (signal !== undefined && !(signal instanceof AbortSignal)) {
    throw new Error("The 'signal' parameter must be an AbortSignal");
  }

  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const msg =
        typeof message === "function"
          ? message()
          : (message ?? `Operation timed out after ${ms}ms`);
      reject(new TimeoutError(msg));
    }, ms);

    if (signal) {
      onAbort = () => reject(signal.reason);
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
    if (signal && onAbort) signal.removeEventListener("abort", onAbort);
  });
}

export { TimeoutError, withTimeout };
