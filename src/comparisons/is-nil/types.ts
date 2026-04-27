interface IsNilParams {
  value: unknown;
}

type IsNilResult = boolean;

type IsNilFn = (params: IsNilParams) => IsNilResult;

export type { IsNilFn, IsNilParams, IsNilResult };
