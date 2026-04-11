interface RetryParams<T> {
  fn: () => Promise<T> | T;
  attempts?: number;
  delay?: number;
  backoff?: "fixed" | "exponential";
  onRetry?: (error: unknown, attempt: number) => void;
}

type RetryResult<T> = Promise<T>;

type RetryFn = <T>(params: RetryParams<T>) => RetryResult<T>;

export type { RetryFn, RetryParams, RetryResult };
