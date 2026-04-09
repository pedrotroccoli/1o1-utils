import type { GroupByParams, GroupByResult } from "./types.js";

function groupBy<T>({ array, key }: GroupByParams<T>): GroupByResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (key === undefined || key === null) {
    throw new Error("The 'key' parameter is required");
  }

  const result: Record<string, T[]> = {};

  for (let i = 0; i < array.length; i++) {
    const groupKey = String(array[i][key]);

    if (result[groupKey] === undefined) {
      result[groupKey] = [];
    }

    result[groupKey].push(array[i]);
  }

  return result;
}

export { groupBy };
