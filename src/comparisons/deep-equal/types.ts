interface DeepEqualParams {
  a: unknown;
  b: unknown;
}

type DeepEqualResult = boolean;

type DeepEqualFn = (params: DeepEqualParams) => DeepEqualResult;

export type { DeepEqualFn, DeepEqualParams, DeepEqualResult };
