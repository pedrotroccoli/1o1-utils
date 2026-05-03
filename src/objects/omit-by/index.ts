import type { OmitByParams } from "./types.js";

/**
 * Creates an object excluding entries for which the predicate returns truthy.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.predicate - Function called per entry; entry is removed if it returns truthy
 * @returns A new object with the filtered entries
 *
 * @example
 * ```ts
 * omitBy({ obj: { a: 1, b: 2, c: 3 }, predicate: (v) => v > 1 });
 * // => { a: 1 }
 * ```
 *
 * @keywords filter object, exclude by value, conditional omit, predicate
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `predicate` is not a function
 */
function omitBy<T extends Record<string, unknown>>({
  obj,
  predicate,
}: OmitByParams<T>): Partial<T> {
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
    const value = obj[key];
    if (!predicate(value, key)) {
      result[key] = value;
    }
  }

  return result;
}

export { omitBy };
