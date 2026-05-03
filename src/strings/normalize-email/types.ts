interface NormalizeEmailParams {
  email: string;
  stripPlus?: boolean;
}

type NormalizeEmailResult = string;

type NormalizeEmailFn = (params: NormalizeEmailParams) => NormalizeEmailResult;

export type {
  NormalizeEmailFn,
  NormalizeEmailParams,
  NormalizeEmailResult,
};
