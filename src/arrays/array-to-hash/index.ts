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

  const hash = new Map<string, T>();

  for (const item of array) {
    if (!item[key] || typeof item[key] !== "string") continue;

    hash.set(item[key], item);
  }

  return Object.fromEntries(hash);
}

export { arrayToHash };
