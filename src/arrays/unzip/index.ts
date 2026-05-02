import type { UnzipParams, UnzipResult } from "./types.js";

/**
 * Splits an array of grouped tuples back into separate arrays — the inverse of `zip`.
 *
 * @param params - The parameters object
 * @param params.array - The array of tuples to ungroup
 * @param params.strategy - How to handle uneven inner lengths: `"fill"` pads shorter tuples with `undefined` (default), `"truncate"` cuts to the shortest tuple
 * @returns An array of arrays grouped by tuple position
 *
 * @example
 * ```ts
 * unzip({ array: [["a", 1], ["b", 2], ["c", 3]] });
 * // => [["a", "b", "c"], [1, 2, 3]]
 * ```
 *
 * @keywords unzip, transpose, ungroup, split tuples
 *
 * @throws Error if `array` is not an array
 * @throws Error if any element of `array` is not an array
 * @throws Error if `strategy` is not `"fill"` or `"truncate"`
 */
function unzip<T>({
  array,
  strategy = "fill",
}: UnzipParams<T>): UnzipResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (strategy !== "fill" && strategy !== "truncate") {
    throw new Error("The 'strategy' parameter must be 'fill' or 'truncate'");
  }

  for (let i = 0; i < array.length; i++) {
    if (!Array.isArray(array[i])) {
      throw new Error("All elements of 'array' must be arrays");
    }
  }

  if (array.length === 0) {
    return [];
  }

  let length = array[0].length;
  for (let i = 1; i < array.length; i++) {
    const innerLength = array[i].length;
    if (strategy === "fill") {
      if (innerLength > length) length = innerLength;
    } else if (innerLength < length) {
      length = innerLength;
    }
  }

  const result: T[][] = new Array(length);
  for (let i = 0; i < length; i++) {
    const group: T[] = new Array(array.length);
    for (let j = 0; j < array.length; j++) {
      group[j] = array[j][i] as T;
    }
    result[i] = group;
  }

  return result;
}

export { unzip };
