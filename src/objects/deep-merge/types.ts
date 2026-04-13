interface DeepMergeParams {
  target: Record<string, unknown>;
  source: Record<string, unknown>;
}

type DeepMergeResult = Record<string, unknown>;

type DeepMergeFn = (params: DeepMergeParams) => DeepMergeResult;

export type { DeepMergeFn, DeepMergeParams, DeepMergeResult };
