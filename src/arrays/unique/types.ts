interface UniqueParams<T> {
  array: T[];
  key?: keyof T;
}

type UniqueResult<T> = T[];

type Unique<T> = (params: UniqueParams<T>) => UniqueResult<T>;

export type { Unique, UniqueParams, UniqueResult };
