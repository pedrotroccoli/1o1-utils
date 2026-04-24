interface WithTimeoutParams<T> {
  promise: Promise<T>;
  ms: number;
  message?: string | (() => string);
  signal?: AbortSignal;
}

type WithTimeoutResult<T> = Promise<T>;

type WithTimeoutFn = <T>(params: WithTimeoutParams<T>) => WithTimeoutResult<T>;

export type { WithTimeoutFn, WithTimeoutParams, WithTimeoutResult };
