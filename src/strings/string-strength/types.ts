type Level = "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong";

type Pool = "lowercase" | "uppercase" | "digit" | "symbol" | "unicode";

type Score = 0 | 1 | 2 | 3 | 4 | 5;

interface StringStrengthParams {
  str: string;
}

interface StringStrengthResult {
  entropy: number;
  effectiveEntropy: number;
  score: Score;
  level: Level;
  pools: Pool[];
  poolCount: number;
}

type StringStrength = (params: StringStrengthParams) => StringStrengthResult;

export type {
  Level,
  Pool,
  Score,
  StringStrength,
  StringStrengthParams,
  StringStrengthResult,
};
