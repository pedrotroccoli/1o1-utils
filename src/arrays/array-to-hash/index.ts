import { ArrayToHashParams, ArrayToHashResult } from "./types";

function arrayToHash<T>({ array, key }: ArrayToHashParams<T>): ArrayToHashResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (typeof key !== "string") {
    throw new Error("The 'key' parameter is not a string");
  }

  let hash = new Map<string, T>();

  for (const item of array) {
    if (!item[key]) continue;

    hash.set(item[key] as string, item);
  }

  return Object.fromEntries(hash);
}

export { arrayToHash };