import type { Memoized, MemoParams } from "./types.js";

/**
 * Memoizes a function: caches its return value per unique argument set so
 * repeat calls skip the computation. Optionally expires entries after `ttl`
 * milliseconds and accepts a custom `key` resolver for control over cache
 * identity.
 *
 * @param params - The parameters object
 * @param params.fn - The function to memoize
 * @param params.ttl - Optional entry lifetime in milliseconds (non-negative).
 *   Omit for no expiry.
 * @param params.key - Optional resolver mapping the call arguments to a cache
 *   key. Omit to use the default hybrid resolver.
 * @returns A memoized wrapper exposing `.clear()`, `.delete(key)`, and `.size`
 *
 * @example
 * ```ts
 * const slow = (n: number) => {
 *   for (let i = 0; i < 1e7; i++);
 *   return n * 2;
 * };
 *
 * const fast = memo({ fn: slow });
 * fast(5); // computes
 * fast(5); // cached
 *
 * const fetchUser = memo({ fn: getUser, ttl: 60_000 });
 * const search = memo({ fn: query, key: (args) => args[0].toLowerCase() });
 * ```
 *
 * @keywords memoize, memo, cache, function cache, ttl cache, result cache, lazy compute
 *
 * @throws Error if `fn` is not a function
 * @throws Error if `ttl` is provided and is not a non-negative number
 * @throws Error if `key` is provided and is not a function
 *
 * @remarks
 * The default key resolver is a hybrid: when the call has a single primitive
 * argument it uses that argument directly (`Map`-keyed by value); otherwise
 * it falls back to `JSON.stringify(args)`. This avoids the lodash footgun of
 * collapsing all object args to the same key while keeping primitive lookups
 * allocation-free. Provide your own `key` for non-serializable args.
 *
 * TTL is measured against `performance.now()`, so cache entries are immune to
 * system clock changes. Expiry is lazy: stale entries are not actively swept
 * — they are recomputed (and overwritten) on the next call for that key.
 *
 * If `fn` throws, the error propagates and the entry is NOT cached, so the
 * next call retries. The `this` context of each call is forwarded to `fn`.
 */
function memo<T extends (...args: never[]) => unknown>({
  fn,
  ttl,
  key: keyFn,
}: MemoParams<T>): Memoized<T> {
  if (typeof fn !== "function") {
    throw new Error("The 'fn' parameter must be a function");
  }

  if (
    ttl !== undefined &&
    (typeof ttl !== "number" || Number.isNaN(ttl) || ttl < 0)
  ) {
    throw new Error("The 'ttl' option must be a non-negative number");
  }

  if (keyFn !== undefined && typeof keyFn !== "function") {
    throw new Error("The 'key' option must be a function");
  }

  let values: Map<unknown, unknown> | undefined;
  let expiries: Map<unknown, number> | undefined;
  const call = fn as unknown as (...a: unknown[]) => unknown;

  let memoized: ((...args: unknown[]) => unknown) & {
    clear: () => void;
    delete: (key: unknown) => boolean;
    size: number;
  };

  if (ttl === undefined) {
    memoized = function (this: unknown) {
      // biome-ignore lint/complexity/noArguments: fast-path, avoids rest-params allocation
      const args = arguments as unknown as unknown[];
      let k: unknown;
      if (keyFn) {
        k = keyFn(args as Parameters<T>);
      } else if (args.length === 1) {
        const a0 = args[0];
        k = typeof a0 !== "object" || a0 === null ? a0 : JSON.stringify(args);
      } else {
        k = JSON.stringify(args);
      }
      if (values !== undefined) {
        const hit = values.get(k);
        if (hit !== undefined || values.has(k)) return hit;
      }
      const value = call.apply(this, args);
      if (values === undefined) values = new Map();
      values.set(k, value);
      memoized.size = values.size;
      return value;
    } as typeof memoized;
  } else {
    memoized = function (this: unknown) {
      // biome-ignore lint/complexity/noArguments: fast-path, avoids rest-params allocation
      const args = arguments as unknown as unknown[];
      let k: unknown;
      if (keyFn) {
        k = keyFn(args as Parameters<T>);
      } else if (args.length === 1) {
        const a0 = args[0];
        k = typeof a0 !== "object" || a0 === null ? a0 : JSON.stringify(args);
      } else {
        k = JSON.stringify(args);
      }
      if (values !== undefined) {
        const exp = (expiries as Map<unknown, number>).get(k);
        if (exp !== undefined && exp > performance.now()) {
          return values.get(k);
        }
      }
      const value = call.apply(this, args);
      if (values === undefined) {
        values = new Map();
        expiries = new Map();
      }
      values.set(k, value);
      (expiries as Map<unknown, number>).set(k, performance.now() + ttl);
      memoized.size = values.size;
      return value;
    } as typeof memoized;
  }

  memoized.size = 0;
  memoized.clear = () => {
    values?.clear();
    expiries?.clear();
    memoized.size = 0;
  };
  memoized.delete = (k: unknown) => {
    if (values === undefined) return false;
    const ok = values.delete(k);
    expiries?.delete(k);
    if (ok) memoized.size = values.size;
    return ok;
  };

  return memoized as unknown as Memoized<T>;
}

export { memo };
