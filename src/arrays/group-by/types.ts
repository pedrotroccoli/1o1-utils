interface GroupByParams<T> {
  array: T[];
  key: keyof T;
}

type GroupByResult<T> = Record<string, T[]>;

export type { GroupByParams, GroupByResult };
