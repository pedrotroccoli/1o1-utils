type PickByPredicate<T extends Record<string, unknown>> = (
  value: T[keyof T],
  key: keyof T & string,
) => boolean;

interface PickByParams<T extends Record<string, unknown>> {
  obj: T;
  predicate: PickByPredicate<T>;
}

type PickByFn<T extends Record<string, unknown>> = (
  params: PickByParams<T>,
) => Partial<T>;

export type { PickByFn, PickByParams, PickByPredicate };
