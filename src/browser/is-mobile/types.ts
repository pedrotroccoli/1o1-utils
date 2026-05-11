interface IsMobileParams {
  userAgent?: string;
  maxWidth?: number;
  width?: number;
}

type IsMobileResult = boolean;

type IsMobileFn = (params?: IsMobileParams) => IsMobileResult;

export type { IsMobileFn, IsMobileParams, IsMobileResult };
