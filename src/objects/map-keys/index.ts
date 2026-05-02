import type { MapKeysParams, MapKeysResult } from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

/**
 * Creates a new object with the same values as `obj`, but with each key
 * replaced by the result of `iteratee(value, key, obj)`. The iteratee result
 * is coerced to a string. When two keys map to the same new key, the last
 * write wins. Prototype-pollution keys (`__proto__`, `constructor`,
 * `prototype`) are skipped.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.iteratee - Function invoked per own enumerable property
 * @returns A new object with transformed keys (input is not mutated)
 *
 * @example
 * ```ts
 * mapKeys({
 *   obj: { a: 1, b: 2 },
 *   iteratee: (value, key) => key.toUpperCase(),
 * });
 * // => { A: 1, B: 2 }
 * ```
 *
 * @keywords map keys, transform keys, rename keys, key mapper
 *
 * @see lodash/mapKeys — semantic reference (https://lodash.com/docs/#mapKeys)
 *
 * @throws Error if `obj` is not a plain object
 * @throws Error if `iteratee` is not a function
 */
function mapKeys<T extends Record<string, unknown>>({
  obj,
  iteratee,
}: MapKeysParams<T>): MapKeysResult<T> {
  if (!isPlainObject(obj)) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (typeof iteratee !== "function") {
    throw new Error("The 'iteratee' parameter is not a function");
  }

  const result: Record<string, T[keyof T]> = {};
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key] as T[keyof T];
    const newKey = String(iteratee(value, key, obj));
    if (UNSAFE_KEYS.has(newKey)) continue;
    result[newKey] = value;
  }

  return result;
}

export { mapKeys };
