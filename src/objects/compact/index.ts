import type { CompactParams } from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Creates a new object with all falsy values removed.
 * Falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
 * Pass `keep` to preserve specific falsy values (matched via `Object.is`).
 * Truthy values inside `keep` are no-ops (truthy entries are always preserved).
 *
 * Only string-keyed enumerable own properties are considered.
 * Symbol-keyed properties are ignored (use `Reflect.ownKeys` if needed).
 *
 * @param params - The parameters object
 * @param params.obj - The source object (must be a plain object, not an array)
 * @param params.keep - Optional array of falsy values to preserve
 * @returns A new object without falsy entries (except those in `keep`)
 *
 * @example
 * ```ts
 * compact({ obj: { a: 1, b: null, c: "", d: 0, e: false, f: "ok" } });
 * // => { a: 1, f: "ok" }
 *
 * compact({ obj: { a: 0, b: null, c: "" }, keep: [0] });
 * // => { a: 0 }
 * ```
 *
 * @keywords remove falsy, clean object, drop empty, prune null, compact object
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `obj` is an array
 * @throws Error if `keep` is not an array
 */
function compact<T extends Record<string, unknown>>({
  obj,
  keep,
}: CompactParams<T>): Partial<T> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (Array.isArray(obj)) {
    throw new Error("The 'obj' parameter must not be an array");
  }

  if (keep !== undefined && !Array.isArray(keep)) {
    throw new Error("The 'keep' parameter is not an array");
  }

  const result: Partial<T> = {};
  const keys = Object.keys(obj) as (keyof T & string)[];
  const hasKeep = keep !== undefined && keep.length > 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (UNSAFE_KEYS.has(key)) continue;
    const value = obj[key];
    if (value) {
      result[key] = value;
      continue;
    }
    if (hasKeep && keep.some((k) => Object.is(k, value))) {
      result[key] = value;
    }
  }

  return result;
}

export { compact };
