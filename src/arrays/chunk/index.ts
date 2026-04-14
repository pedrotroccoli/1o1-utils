import type { ChunkParams, ChunkResult } from "./types.js";

/**
 * Splits an array into groups of the given size.
 *
 * @param params - The parameters object
 * @param params.array - The array to split into chunks
 * @param params.size - The maximum size of each chunk (must be a positive integer)
 * @returns An array of arrays, each containing at most `size` elements
 *
 * @example
 * ```ts
 * chunk({ array: [1, 2, 3, 4, 5], size: 2 });
 * // => [[1, 2], [3, 4], [5]]
 * ```
 *
 * @throws Error if `array` is not an array
 * @throws Error if `size` is not a positive integer
 */
function chunk<T>({ array, size }: ChunkParams<T>): ChunkResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (typeof size !== "number" || size <= 0 || !Number.isInteger(size)) {
    throw new Error("The 'size' parameter must be a positive integer");
  }

  const length = Math.ceil(array.length / size);
  const result: T[][] = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = array.slice(i * size, i * size + size);
  }

  return result;
}

export { chunk };
