interface SecondsToTimeFormatParams {
  seconds: number;
  padHours?: boolean;
}

type SecondsToTimeFormatResult = string;

type SecondsToTimeFormat = (
  params: SecondsToTimeFormatParams,
) => SecondsToTimeFormatResult;

export type {
  SecondsToTimeFormat,
  SecondsToTimeFormatParams,
  SecondsToTimeFormatResult,
};
