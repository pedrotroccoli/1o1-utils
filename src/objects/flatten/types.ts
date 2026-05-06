interface FlattenArrayParams {
  value: readonly unknown[];
  depth?: number;
}

interface FlattenObjectParams {
  value: Record<string, unknown>;
  depth?: never;
}

type FlattenParams = FlattenArrayParams | FlattenObjectParams;

interface FlattenFn {
  (params: FlattenArrayParams): unknown[];
  (params: FlattenObjectParams): Record<string, unknown>;
}

export type {
  FlattenArrayParams,
  FlattenFn,
  FlattenObjectParams,
  FlattenParams,
};
