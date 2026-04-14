import type { ArrayToHashParams, ArrayToHashResult } from "./types.js";

/**
 * Converts an array of objects into a hash map keyed by a specified property.
 *
 * @param params - The parameters object
 * @param params.array - The array of objects to convert
 * @param params.key - The property to use as the hash key
 * @returns An object keyed by the specified property values
 *
 * @example
 * ```ts
 * arrayToHash({ array: [{ id: "a", name: "Alice" }], key: "id" });
 * // => { a: { id: "a", name: "Alice" } }
 * ```
 *
 * @throws Error if `array` is not an array
 * @throws Error if `key` is not a string
 */
function arrayToHash<T>({
  array,
  key,
}: ArrayToHashParams<T>): ArrayToHashResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (typeof key !== "string") {
    throw new Error("The 'key' parameter is not a string");
  }

  const result: Record<string, T> = {};

  for (let i = 0; i < array.length; i++) {
    const k = array[i][key];
    if (!k || typeof k !== "string") continue;

    result[k] = array[i];
  }

  return result;
}

export { arrayToHash };
