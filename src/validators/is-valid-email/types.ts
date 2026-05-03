interface IsValidEmailParams {
  email: unknown;
  allowDisplayName?: boolean;
}

type IsValidEmailResult = boolean;

type IsValidEmailFn = (params: IsValidEmailParams) => IsValidEmailResult;

export type { IsValidEmailFn, IsValidEmailParams, IsValidEmailResult };
