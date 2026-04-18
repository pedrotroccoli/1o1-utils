interface ShallowEqualParams {
  a: unknown;
  b: unknown;
}

type ShallowEqualResult = boolean;

type ShallowEqualFn = (params: ShallowEqualParams) => ShallowEqualResult;

export type { ShallowEqualFn, ShallowEqualParams, ShallowEqualResult };
