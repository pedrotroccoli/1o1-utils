type CaseStyle = "camel" | "kebab" | "snake" | "pascal";

interface TransformCaseParams {
  str: string;
  to: CaseStyle;
}

type TransformCaseResult = string;

type TransformCaseFn = (params: TransformCaseParams) => TransformCaseResult;

export type {
  CaseStyle,
  TransformCaseFn,
  TransformCaseParams,
  TransformCaseResult,
};
