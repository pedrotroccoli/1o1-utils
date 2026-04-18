type AnyFn = (...args: never[]) => unknown;

interface PipeFn {
  (): <T>(x: T) => T;
  <A extends unknown[], R>(f1: (...args: A) => R): (...args: A) => R;
  <A extends unknown[], B, R>(
    f1: (...args: A) => B,
    f2: (b: B) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, F, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, F, G, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => G,
    f7: (g: G) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, F, G, H, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => G,
    f7: (g: G) => H,
    f8: (h: H) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, F, G, H, I, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => G,
    f7: (g: G) => H,
    f8: (h: H) => I,
    f9: (i: I) => R,
  ): (...args: A) => R;
  <A extends unknown[], B, C, D, E, F, G, H, I, J, R>(
    f1: (...args: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => G,
    f7: (g: G) => H,
    f8: (h: H) => I,
    f9: (i: I) => J,
    f10: (j: J) => R,
  ): (...args: A) => R;
  (...fns: AnyFn[]): (...args: unknown[]) => unknown;
}

export type { PipeFn };
