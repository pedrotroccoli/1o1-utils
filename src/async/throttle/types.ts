interface ThrottleParams<T extends (...args: unknown[]) => unknown> {
  fn: T;
  ms: number;
}

type Throttled<T extends (...args: unknown[]) => unknown> = T & {
  cancel: () => void;
};

type ThrottleFn = <T extends (...args: unknown[]) => unknown>(
  params: ThrottleParams<T>,
) => Throttled<T>;

export type { Throttled, ThrottleFn, ThrottleParams };
