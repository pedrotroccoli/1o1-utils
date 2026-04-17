interface DefaultsParams {
  target: Record<string, unknown>;
  source: Record<string, unknown>;
}

type DefaultsResult = Record<string, unknown>;

type DefaultsFn = (params: DefaultsParams) => DefaultsResult;

export type { DefaultsFn, DefaultsParams, DefaultsResult };
