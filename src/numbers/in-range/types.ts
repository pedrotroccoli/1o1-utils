interface InRangeParams {
  value: number;
  start: number;
  end: number;
}

type InRangeResult = boolean;

type InRange = (params: InRangeParams) => InRangeResult;

export type { InRange, InRangeParams, InRangeResult };
