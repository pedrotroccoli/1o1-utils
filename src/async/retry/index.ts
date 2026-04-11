import type { RetryParams } from "./types.js";

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
