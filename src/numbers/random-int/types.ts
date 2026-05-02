interface RandomIntParams {
  min: number;
  max: number;
}

type RandomIntResult = number;

type RandomInt = (params: RandomIntParams) => RandomIntResult;

export type { RandomInt, RandomIntParams, RandomIntResult };
