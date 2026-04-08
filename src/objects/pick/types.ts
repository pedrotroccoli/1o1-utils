interface PickParams<T extends Record<string, unknown>> {
  obj: T;
  keys: (keyof T | string)[];
}

type PickFn<T extends Record<string, unknown>> = (
  params: PickParams<T>,
) => Record<string, unknown>;

export type { PickFn, PickParams };
