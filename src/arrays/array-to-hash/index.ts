import type { ArrayToHashParams, ArrayToHashResult } from "./types.js";

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
