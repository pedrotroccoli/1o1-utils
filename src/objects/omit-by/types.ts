type OmitByPredicate<T extends Record<string, unknown>> = (
  value: T[keyof T],
  key: keyof T & string,
) => boolean;

interface OmitByParams<T extends Record<string, unknown>> {
  obj: T;
  predicate: OmitByPredicate<T>;
}

type OmitByFn<T extends Record<string, unknown>> = (
  params: OmitByParams<T>,
) => Partial<T>;

export type { OmitByFn, OmitByParams, OmitByPredicate };
