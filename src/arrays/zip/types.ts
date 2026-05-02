type ZipStrategy = "fill" | "truncate";

interface ZipParams<T> {
  arrays: T[][];
  strategy?: ZipStrategy;
}

type ZipResult<T> = T[][];

type Zip<T> = (params: ZipParams<T>) => ZipResult<T>;

export type { Zip, ZipParams, ZipResult, ZipStrategy };
