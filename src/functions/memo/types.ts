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

type MemoFn = <T extends (...args: never[]) => unknown>(
  params: MemoParams<T>,
) => Memoized<T>;

export type { MemoFn, Memoized, MemoParams };
