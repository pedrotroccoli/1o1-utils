interface CompactParams<T extends Record<string, unknown>> {
  obj: T;
  keep?: unknown[];
}

type CompactFn<T extends Record<string, unknown>> = (
  params: CompactParams<T>,
) => Partial<T>;

export type { CompactFn, CompactParams };
