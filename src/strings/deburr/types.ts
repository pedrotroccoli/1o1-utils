interface DeburrParams {
  str: string;
}

type DeburrResult = string;

type Deburr = (params: DeburrParams) => DeburrResult;

export type { Deburr, DeburrParams, DeburrResult };
