interface PickParams<T extends Record<string, unknown>, K extends keyof T> {
  obj: T;
  keys: K[];
}

type PickResult<T extends Record<string, unknown>, K extends keyof T> = Pick<
  T,
  K
>;

type PickFn<T extends Record<string, unknown>, K extends keyof T> = (
  params: PickParams<T, K>,
) => PickResult<T, K>;

export type { PickFn, PickParams, PickResult };
