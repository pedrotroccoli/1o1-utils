interface UnflattenParams {
  obj: Record<string, unknown>;
  arrays?: boolean;
}

type UnflattenFn = (params: UnflattenParams) => Record<string, unknown>;

export type { UnflattenFn, UnflattenParams };
