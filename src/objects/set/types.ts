interface SetParams<T extends Record<string, unknown>> {
  obj: T;
  path: string;
  value: unknown;
  objectify?: boolean;
}

type SetFn = <T extends Record<string, unknown>>(
  params: SetParams<T>,
) => Record<string, unknown>;

export type { SetFn, SetParams };
