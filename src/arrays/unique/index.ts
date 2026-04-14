import type { UniqueParams, UniqueResult } from "./types.js";

/**
 * Removes duplicate elements from an array.
 *
 * @param params - The parameters object
 * @param params.array - The array to deduplicate
 * @param params.key - Optional property to determine uniqueness for objects
 * @returns A new array with duplicates removed
 *
 * @example
 * ```ts
 * unique({ array: [1, 2, 2, 3] });
 * // => [1, 2, 3]
 * ```
 *
 * @throws Error if `array` is not an array
 */
function unique<T>({ array, key }: UniqueParams<T>): UniqueResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (key === undefined) {
    return [...new Set(array)];
  }

  const seen = new Set<unknown>();
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i][key];
    if (!seen.has(value)) {
      seen.add(value);
      result.push(array[i]);
    }
  }

  return result;
}

export { unique };
