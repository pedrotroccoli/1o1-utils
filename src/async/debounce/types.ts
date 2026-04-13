interface DebounceParams<T extends (...args: unknown[]) => unknown> {
  fn: T;
  ms: number;
}

type Debounced<T extends (...args: unknown[]) => unknown> = T & {
  cancel: () => void;
};

type DebounceFn = <T extends (...args: unknown[]) => unknown>(
  params: DebounceParams<T>,
) => Debounced<T>;

export type { Debounced, DebounceFn, DebounceParams };
