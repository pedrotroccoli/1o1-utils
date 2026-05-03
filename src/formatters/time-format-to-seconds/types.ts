interface TimeFormatToSecondsParams {
  time: string;
}

type TimeFormatToSecondsResult = number;

type TimeFormatToSeconds = (
  params: TimeFormatToSecondsParams,
) => TimeFormatToSecondsResult;

export type {
  TimeFormatToSeconds,
  TimeFormatToSecondsParams,
  TimeFormatToSecondsResult,
};
