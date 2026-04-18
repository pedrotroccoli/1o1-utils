type CaseStyle = "camel" | "kebab" | "snake" | "pascal" | "title";

interface TransformCaseParams {
  str: string;
  to: CaseStyle;
  preserveAcronyms?: boolean;
}

type TransformCaseResult = string;

type TransformCaseFn = (params: TransformCaseParams) => TransformCaseResult;

export type {
  CaseStyle,
  TransformCaseFn,
  TransformCaseParams,
  TransformCaseResult,
};
