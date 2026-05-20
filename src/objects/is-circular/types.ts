interface IsCircularParams {
  value: unknown;
}

type IsCircularResult = boolean;

type IsCircularFn = (params: IsCircularParams) => IsCircularResult;

export type { IsCircularFn, IsCircularParams, IsCircularResult };
