interface ToNumberParams {
  value: string;
  locale?: string;
}

type ToNumberResult = number;

type ToNumber = (params: ToNumberParams) => ToNumberResult;

export type { ToNumber, ToNumberParams, ToNumberResult };
