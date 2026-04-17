interface DefaultsDeepParams {
  target: Record<string, unknown>;
  source: Record<string, unknown>;
}

type DefaultsDeepResult = Record<string, unknown>;

type DefaultsDeepFn = (params: DefaultsDeepParams) => DefaultsDeepResult;

export type { DefaultsDeepFn, DefaultsDeepParams, DefaultsDeepResult };
