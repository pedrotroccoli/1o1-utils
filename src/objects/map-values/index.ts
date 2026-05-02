import type { MapValuesParams, MapValuesResult } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

/**
 * Creates a new object with the same keys as `obj`, but with each value
 * replaced by the result of `iteratee(value, key, obj)`. Only own enumerable
 * properties are visited.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.iteratee - Function invoked per own enumerable property
 * @returns A new object with transformed values (input is not mutated)
 *
 * @example
 * ```ts
 * mapValues({
 *   obj: { a: 1, b: 2 },
 *   iteratee: (value) => value * 10,
 * });
 * // => { a: 10, b: 20 }
 * ```
 *
 * @keywords map values, transform values, value mapper, project values
 *
 * @see lodash/mapValues — semantic reference (https://lodash.com/docs/#mapValues)
 *
 * @throws Error if `obj` is not a plain object
 * @throws Error if `iteratee` is not a function
 */
function mapValues<T extends Record<string, unknown>, R>({
  obj,
  iteratee,
}: MapValuesParams<T, R>): MapValuesResult<T, R> {
  if (!isPlainObject(obj)) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (typeof iteratee !== "function") {
    throw new Error("The 'iteratee' parameter is not a function");
  }

  const result = {} as MapValuesResult<T, R>;
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key] as T[keyof T];
    result[key as keyof T] = iteratee(value, key, obj);
  }

  return result;
}

export { mapValues };
