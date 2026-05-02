interface EscapeRegExpParams {
  str: string;
}

type EscapeRegExpResult = string;

type EscapeRegExpFn = (params: EscapeRegExpParams) => EscapeRegExpResult;

export type { EscapeRegExpFn, EscapeRegExpParams, EscapeRegExpResult };
