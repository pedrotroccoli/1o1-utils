interface RangeParams {
  start?: number;
  end: number;
  step?: number;
}

type RangeResult = number[];

type Range = (params: RangeParams) => RangeResult;

export type { Range, RangeParams, RangeResult };
