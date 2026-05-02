import type { DiffParams, DiffResult } from "./types.js";

/**
 * Returns a new array of elements present in `array` but not in `values`.
 *
 * For arrays of objects, pass an `iteratee` function to derive the identity
 * value used for comparison.
 *
 * @param params - The parameters object
 * @param params.array - The source array to filter
 * @param params.values - The values to exclude from the source array
 * @param params.iteratee - Optional function returning the identity value used to compare items
 * @returns A new array containing elements from `array` not present in `values`
 *
 * @example
 * ```ts
 * diff({ array: [1, 2, 3, 4], values: [2, 4] });
 * // => [1, 3]
 *
 * diff({
 *   array: [{ id: 1 }, { id: 2 }, { id: 3 }],
 *   values: [{ id: 2 }],
 *   iteratee: (item) => item.id,
 * });
 * // => [{ id: 1 }, { id: 3 }]
 * ```
 *
 * @keywords difference, except, exclude, subtract arrays, set difference, differenceBy
 * @see Lodash difference (https://lodash.com/docs/4.17.15#difference)
 *
 * @throws Error if `array` is not an array
 * @throws Error if `values` is not an array
 * @throws Propagates any error thrown by `iteratee`
 */
function diff<T>({ array, values, iteratee }: DiffParams<T>): DiffResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (!Array.isArray(values)) {
    throw new Error("The 'values' parameter is not an array");
  }

  const arrayLen = array.length;
  const valuesLen = values.length;
  const result: T[] = [];

  if (valuesLen === 0) {
    for (let i = 0; i < arrayLen; i++) {
      result.push(array[i]);
    }
    return result;
  }

  if (iteratee === undefined) {
    const excluded = new Set(values);
    for (let i = 0; i < arrayLen; i++) {
      const item = array[i];
      if (!excluded.has(item)) {
        result.push(item);
      }
    }
    return result;
  }

  const excluded = new Set<unknown>();
  for (let i = 0; i < valuesLen; i++) {
    excluded.add(iteratee(values[i]));
  }
  for (let i = 0; i < arrayLen; i++) {
    const item = array[i];
    if (!excluded.has(iteratee(item))) {
      result.push(item);
    }
  }
  return result;
}

export { diff };
