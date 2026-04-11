interface IsEmptyParams {
  value: unknown;
}

type IsEmptyResult = boolean;

type IsEmptyFn = (params: IsEmptyParams) => IsEmptyResult;

export type { IsEmptyFn, IsEmptyParams, IsEmptyResult };
