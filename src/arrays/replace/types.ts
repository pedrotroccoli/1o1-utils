type ReplaceUpdater<T> = (item: T, index: number) => T;

interface ReplaceParams<T> {
  array: T[];
  predicate: (item: T, index: number) => boolean;
  value: T | ReplaceUpdater<T>;
  all?: boolean;
}

type ReplaceResult<T> = T[];

type Replace = <T>(params: ReplaceParams<T>) => ReplaceResult<T>;

export type { Replace, ReplaceParams, ReplaceResult, ReplaceUpdater };
