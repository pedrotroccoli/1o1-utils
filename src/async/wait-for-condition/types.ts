interface WaitForConditionParams {
  condition: () => boolean | Promise<boolean>;
  interval?: number;
  timeout?: number;
  message?: string | (() => string);
  signal?: AbortSignal;
}

type WaitForConditionResult = Promise<void>;

type WaitForConditionFn = (
  params: WaitForConditionParams,
) => WaitForConditionResult;

export type {
  WaitForConditionFn,
  WaitForConditionParams,
  WaitForConditionResult,
};
