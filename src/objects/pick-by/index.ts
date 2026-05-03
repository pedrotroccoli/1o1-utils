import type { PickByParams } from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Creates an object with only the entries for which the predicate returns truthy.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.predicate - Function called per entry; entry is kept if it returns truthy
 * @returns A new object with the filtered entries
 *
 * @example
 * ```ts
 * pickBy({ obj: { a: 1, b: null, c: 3 }, predicate: (v) => v !== null });
 * // => { a: 1, c: 3 }
 * ```
 *
 * @keywords filter object, select by value, conditional pick, predicate
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `predicate` is not a function
 */
function pickBy<T extends Record<string, unknown>>({
  obj,
  predicate,
}: PickByParams<T>): Partial<T> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (typeof predicate !== "function") {
    throw new Error("The 'predicate' parameter is not a function");
  }

  const result: Partial<T> = {};
  const keys = Object.keys(obj) as (keyof T & string)[];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (UNSAFE_KEYS.has(key)) continue;
    const value = obj[key];
    if (predicate(value, key)) {
      result[key] = value;
    }
  }

  return result;
}

export { pickBy };
