interface IsValidUrlParams {
  url: unknown;
}

type IsValidUrlResult = boolean;

type IsValidUrlFn = (params: IsValidUrlParams) => IsValidUrlResult;

export type { IsValidUrlFn, IsValidUrlParams, IsValidUrlResult };
