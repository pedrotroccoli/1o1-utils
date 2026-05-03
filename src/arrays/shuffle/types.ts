interface ShuffleParams<T> {
  array: T[];
  random?: () => number;
}

type ShuffleResult<T> = T[];

type Shuffle<T> = (params: ShuffleParams<T>) => ShuffleResult<T>;

export type { Shuffle, ShuffleParams, ShuffleResult };
