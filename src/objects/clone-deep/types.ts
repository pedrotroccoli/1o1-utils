interface CloneDeepParams<T = unknown> {
  value: T;
}

type CloneDeepResult<T = unknown> = T;

type CloneDeepFn = <T>(params: CloneDeepParams<T>) => CloneDeepResult<T>;

export type { CloneDeepFn, CloneDeepParams, CloneDeepResult };
