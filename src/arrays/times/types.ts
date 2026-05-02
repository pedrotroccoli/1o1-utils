type TimesFn<T> = (index: number) => T;

interface TimesParams<T> {
  count: number;
  fn: TimesFn<T>;
}

type TimesResult<T> = T[];

type Times = <T>(params: TimesParams<T>) => TimesResult<T>;

export type { Times, TimesFn, TimesParams, TimesResult };
