import type { PickParams, PickResult } from "./types.js";

function pick<T extends Record<string, unknown>, K extends keyof T>({
  obj,
  keys,
}: PickParams<T, K>): PickResult<T, K> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (!Array.isArray(keys)) {
    throw new Error("The 'keys' parameter is not an array");
  }

  const result = {} as PickResult<T, K>;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

export { pick };
