import type { UniqueParams, UniqueResult } from "./types.js";

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
