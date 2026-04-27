interface IsValidUrlParams {
  url: unknown;
  protocols?: string | readonly string[];
}

type IsValidUrlResult = boolean;

type IsValidUrlFn = (params: IsValidUrlParams) => IsValidUrlResult;

export type { IsValidUrlFn, IsValidUrlParams, IsValidUrlResult };
