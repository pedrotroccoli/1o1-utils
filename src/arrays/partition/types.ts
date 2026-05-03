interface PartitionParams<T> {
  array: T[];
  predicate: (item: T, index: number) => boolean;
}

interface PartitionTypeGuardParams<T, U extends T> {
  array: T[];
  predicate: (item: T, index: number) => item is U;
}

type PartitionResult<T> = [T[], T[]];

type PartitionTypeGuardResult<T, U extends T> = [U[], Exclude<T, U>[]];

interface Partition {
  <T, U extends T>(
    params: PartitionTypeGuardParams<T, U>,
  ): PartitionTypeGuardResult<T, U>;
  <T>(params: PartitionParams<T>): PartitionResult<T>;
}

export type {
  Partition,
  PartitionParams,
  PartitionResult,
  PartitionTypeGuardParams,
  PartitionTypeGuardResult,
};
