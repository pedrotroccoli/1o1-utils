interface MemoParams<T extends (...args: never[]) => unknown> {
  fn: T;
  ttl?: number;
  key?: (args: Parameters<T>) => unknown;
}

type Memoized<T extends (...args: never[]) => unknown> = T & {
  clear: () => void;
  delete: (key: unknown) => boolean;
  readonly size: number;
};

export type { Memoized, MemoParams };
