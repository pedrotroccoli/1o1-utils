interface ArrayToHashParams<T> {
  array: T[];
  key: keyof T;
}

interface ArrayToHashResult<T> {
  [key: string]: T;
}

type ArrayToHash<T> = (params: ArrayToHashParams<T>) => ArrayToHashResult<T>;

export type { ArrayToHash, ArrayToHashParams, ArrayToHashResult };
