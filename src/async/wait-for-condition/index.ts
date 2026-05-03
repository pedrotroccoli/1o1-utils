import { TimeoutError } from "../with-timeout/index.js";
import type { WaitForConditionParams } from "./types.js";

/**
 * Polls a condition function at a given interval until it returns truthy or
 * the timeout elapses. Supports sync and async predicates, and an optional
 * AbortSignal for external cancellation.
 *
 * @param params - The parameters object
 * @param params.condition - Sync or async function returning a boolean
 * @param params.interval - Polling interval in milliseconds (default: 100)
 * @param params.timeout - Maximum total wait in milliseconds (default: 5000)
 * @param params.message - Error message or lazy factory (default: `Condition not met within {timeout}ms`)
 * @param params.signal - Optional AbortSignal; rejects with `signal.reason` when aborted
 * @returns A promise that resolves when the condition is truthy
 *
 * @example
 * ```ts
 * await waitForCondition({
 *   condition: () => document.querySelector("#app") !== null,
 *   interval: 100,
 *   timeout: 5000,
 * });
 * ```
 *
 * @keywords poll, wait until, busy wait, await condition, retry until true
 *
 * @throws Error if `condition` is not a function
 * @throws Error if `interval` is not a non-negative number
 * @throws Error if `timeout` is not a non-negative number
 * @throws Error if `signal` is not an AbortSignal
 * @throws TimeoutError if `timeout` elapses before the condition is met
 */
async function waitForCondition({
  condition,
  interval = 100,
  timeout = 5000,
  message,
  signal,
}: WaitForConditionParams): Promise<void> {
  if (typeof condition !== "function") {
    throw new Error("The 'condition' parameter must be a function");
  }

  if (typeof interval !== "number" || Number.isNaN(interval)) {
    throw new Error("The 'interval' parameter must be a number");
  }

  if (interval < 0) {
    throw new Error("The 'interval' parameter must be a non-negative number");
  }

  if (typeof timeout !== "number" || Number.isNaN(timeout)) {
    throw new Error("The 'timeout' parameter must be a number");
  }

  if (timeout < 0) {
    throw new Error("The 'timeout' parameter must be a non-negative number");
  }

  if (signal !== undefined && !(signal instanceof AbortSignal)) {
    throw new Error("The 'signal' parameter must be an AbortSignal");
  }

  if (signal?.aborted) {
    throw signal.reason;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;

  const cancel = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const msg =
        typeof message === "function"
          ? message()
          : (message ?? `Condition not met within ${timeout}ms`);
      reject(new TimeoutError(msg));
    }, timeout);

    if (signal) {
      onAbort = () => reject(signal.reason);
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

  cancel.catch(() => {});

  try {
    while (true) {
      const result = await Promise.race([
        Promise.resolve().then(() => condition()),
        cancel,
      ]);
      if (result) return;
      await Promise.race([
        new Promise<void>((resolve) => setTimeout(resolve, interval)),
        cancel,
      ]);
    }
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    if (signal && onAbort) signal.removeEventListener("abort", onAbort);
  }
}

export { waitForCondition };
