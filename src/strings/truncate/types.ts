interface TruncateParams {
  str: string;
  length: number;
  suffix?: string;
}

type TruncateResult = string;

type Truncate = (params: TruncateParams) => TruncateResult;

export type { Truncate, TruncateParams, TruncateResult };
