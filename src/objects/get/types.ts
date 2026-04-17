interface GetParams<T> {
  obj: T;
  path: string;
  defaultValue?: unknown;
}

type GetFn = <T>(params: GetParams<T>) => unknown;

export type { GetFn, GetParams };
