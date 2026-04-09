interface OmitParams<T extends Record<string, unknown>> {
  obj: T;
  keys: (keyof T | string)[];
}

type OmitFn<T extends Record<string, unknown>> = (
  params: OmitParams<T>,
) => Record<string, unknown>;

export type { OmitFn, OmitParams };
