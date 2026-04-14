import type { RetryParams } from "./types.js";

/**
 * Retries an async function with configurable backoff strategy.
 *
 * @param params - The parameters object
 * @param params.fn - The function to retry
 * @param params.attempts - Maximum number of attempts (default: 3)
 * @param params.delay - Delay between retries in ms (default: 1000)
 * @param params.backoff - Backoff strategy: "fixed" (default) or "exponential"
 * @param params.onRetry - Optional callback invoked on each retry
 * @returns The result of the first successful call
 *
 * @example
 * ```ts
 * const data = await retry({ fn: () => fetch("/api"), attempts: 5, backoff: "exponential" });
 * ```
 *
 * @throws Error if `fn` is not a function
 * @throws The last error if all attempts fail
 */
async function retry<T>({
  fn,
  attempts = 3,
  delay = 1000,
  backoff = "fixed",
  onRetry,
}: RetryParams<T>): Promise<T> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (
    typeof attempts !== "number" ||
    attempts < 1 ||
    !Number.isInteger(attempts)
  ) {
    throw new Error("The 'attempts' parameter must be a positive integer");
  }

  if (typeof delay !== "number" || delay < 0 || Number.isNaN(delay)) {
    throw new Error("The 'delay' parameter must be a non-negative number");
  }

  if (backoff !== "fixed" && backoff !== "exponential") {
    throw new Error("The 'backoff' parameter must be 'fixed' or 'exponential'");
  }

  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < attempts - 1) {
        if (onRetry) onRetry(error, i + 1);

        const wait = backoff === "exponential" ? delay * 2 ** i : delay;
        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait));
        }
      }
    }
  }

  throw lastError;
}

export { retry };
