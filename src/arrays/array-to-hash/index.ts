import { ArrayToHashParams, ArrayToHashResult } from "./types";

function arrayToHash<T>({ array, key }: ArrayToHashParams<T>): ArrayToHashResult<T> {
  let hash = new Map<string, T>();

  for (const item of array) {
    if (!item[key]) continue;

    hash.set(item[key] as string, item);
  }

  return Object.fromEntries(hash);
}

export { arrayToHash };