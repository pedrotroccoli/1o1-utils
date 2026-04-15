import type { GroupByParams, GroupByResult } from "./types.js";

/**
 * Groups array elements by a specified property value.
 *
 * @param params - The parameters object
 * @param params.array - The array to group
 * @param params.key - The property to group by
 * @returns An object where keys are group values and values are arrays of matching items
 *
 * @example
 * ```ts
 * groupBy({ array: [{ role: "admin", name: "Alice" }, { role: "user", name: "Bob" }], key: "role" });
 * // => { admin: [{ role: "admin", name: "Alice" }], user: [{ role: "user", name: "Bob" }] }
 * ```
 *
 * @keywords categorize, bucket, cluster, group array
 *
 * @throws Error if `array` is not an array
 * @throws Error if `key` is undefined or null
 */
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
