import type { ChunkParams, ChunkResult } from "./types.js";

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
