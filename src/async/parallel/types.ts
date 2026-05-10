type ParallelSettledResult<R> =
  | { status: "fulfilled"; value: R }
  | { status: "rejected"; reason: unknown };

interface ParallelParams<T, R> {
  items: readonly T[];
  concurrency: number;
  fn: (item: T, index: number) => Promise<R> | R;
  signal?: AbortSignal;
}

type ParallelResult<R> = Promise<Array<ParallelSettledResult<R>>>;

type ParallelFn = <T, R>(params: ParallelParams<T, R>) => ParallelResult<R>;

export type {
  ParallelFn,
  ParallelParams,
  ParallelResult,
  ParallelSettledResult,
};
