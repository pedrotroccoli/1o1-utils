import type { UniqueParams, UniqueResult } from "./types.js";

function unique<T>({ array, key }: UniqueParams<T>): UniqueResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (key === undefined) {
    return [...new Set(array)];
  }

  const seen = new Map<unknown, T>();

  for (const item of array) {
    const value = item[key];
    if (!seen.has(value)) {
      seen.set(value, item);
    }
  }

  return [...seen.values()];
}

export { unique };
