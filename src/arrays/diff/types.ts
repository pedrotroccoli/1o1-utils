interface DiffParams<T> {
  array: T[];
  values: T[];
  iteratee?: (item: T) => unknown;
}

type DiffResult<T> = T[];

type Diff = <T>(params: DiffParams<T>) => DiffResult<T>;

export type { Diff, DiffParams, DiffResult };
