interface SleepParams {
  ms: number;
}

type SleepResult = Promise<void>;

type SleepFn = (params: SleepParams) => SleepResult;

export type { SleepFn, SleepParams, SleepResult };
