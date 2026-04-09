interface GroupByParams<T> {
  array: T[];
  key: keyof T;
}

type GroupByResult<T> = Record<string, T[]>;

type GroupBy<T> = (params: GroupByParams<T>) => GroupByResult<T>;

export type { GroupBy, GroupByParams, GroupByResult };
