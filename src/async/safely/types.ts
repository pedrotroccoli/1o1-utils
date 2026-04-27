type SafelyResult<T> = [undefined, T] | [unknown, undefined];

type SafelyFn = {
  <A extends unknown[], T>(
    fn: (...args: A) => Promise<T>,
  ): (...args: A) => Promise<SafelyResult<T>>;
  <A extends unknown[], T>(
    fn: (...args: A) => T,
  ): (...args: A) => SafelyResult<T>;
};

export type { SafelyFn, SafelyResult };
