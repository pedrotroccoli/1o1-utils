interface ArrayToHashParams<T> {
  array: T[];
  key: keyof T;
}

interface ArrayToHashResult<T> {
  [key: string]: T;
}

interface ArrayToHash<T> {
  (params: ArrayToHashParams<T>): ArrayToHashResult<T>;
}

export type { ArrayToHashParams, ArrayToHashResult, ArrayToHash };