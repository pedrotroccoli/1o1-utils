interface CapitalizeParams {
  str: string;
  preserveRest?: boolean;
}

type CapitalizeResult = string;

type CapitalizeFn = (params: CapitalizeParams) => CapitalizeResult;

export type { CapitalizeFn, CapitalizeParams, CapitalizeResult };
