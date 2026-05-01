type UnzipStrategy = "fill" | "truncate";

interface UnzipParams<T> {
  array: T[][];
  strategy?: UnzipStrategy;
}

type UnzipResult<T> = T[][];

type Unzip<T> = (params: UnzipParams<T>) => UnzipResult<T>;

export type { Unzip, UnzipParams, UnzipResult, UnzipStrategy };
