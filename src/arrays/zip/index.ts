import type { ZipParams, ZipResult } from "./types.js";

/**
 * Combines arrays by position into tuples.
 *
 * @param params - The parameters object
 * @param params.arrays - The arrays to combine
 * @param params.strategy - How to handle uneven lengths: `"fill"` pads shorter arrays with `undefined` (default), `"truncate"` cuts to the shortest array
 * @returns An array of tuples grouped by index
 *
 * @example
 * ```ts
 * zip({ arrays: [["a", "b", "c"], [1, 2, 3]] });
 * // => [["a", 1], ["b", 2], ["c", 3]]
 *
 * zip({ arrays: [["a", "b"], [1]], strategy: "truncate" });
 * // => [["a", 1]]
 * ```
 *
 * @keywords zip, pair, interleave, combine arrays, transpose
 *
 * @throws Error if `arrays` is not an array
 * @throws Error if any element of `arrays` is not an array
 * @throws Error if `strategy` is not `"fill"` or `"truncate"`
 */
function zip<T>({ arrays, strategy = "fill" }: ZipParams<T>): ZipResult<T> {
  if (!Array.isArray(arrays)) {
    throw new Error("The 'arrays' parameter is not an array");
  }

  if (strategy !== "fill" && strategy !== "truncate") {
    throw new Error("The 'strategy' parameter must be 'fill' or 'truncate'");
  }

  for (let i = 0; i < arrays.length; i++) {
    if (!Array.isArray(arrays[i])) {
      throw new Error("All elements of 'arrays' must be arrays");
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  let length = arrays[0].length;
  for (let i = 1; i < arrays.length; i++) {
    const innerLength = arrays[i].length;
    if (strategy === "fill") {
      if (innerLength > length) length = innerLength;
    } else if (innerLength < length) {
      length = innerLength;
    }
  }

  const result: T[][] = new Array(length);
  for (let i = 0; i < length; i++) {
    const tuple: T[] = new Array(arrays.length);
    for (let j = 0; j < arrays.length; j++) {
      tuple[j] = arrays[j][i] as T;
    }
    result[i] = tuple;
  }

  return result;
}

export { zip };
