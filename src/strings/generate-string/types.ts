type Charset = "all" | "alphanumeric" | "alpha" | "numeric" | "hex" | "custom";

interface GenerateStringParams {
  length: number;
  charset?: Charset;
  chars?: string;
  dedupe?: boolean;
  minChars?: number;
}

type GenerateStringResult = string;

type GenerateString = (params: GenerateStringParams) => GenerateStringResult;

export type {
  Charset,
  GenerateString,
  GenerateStringParams,
  GenerateStringResult,
};
