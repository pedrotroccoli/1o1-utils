import type { SortByParams } from "./types.js";

function getByPath(obj: unknown, path: string): unknown {
  let current: unknown = obj;
  let start = 0;
  let dot = path.indexOf(".");

  while (dot !== -1) {
    if (typeof current !== "object" || current === null) return undefined;
    const seg = path.substring(start, dot);
    current = (current as Record<string, unknown>)[seg];
    start = dot + 1;
    dot = path.indexOf(".", start);
  }

  if (typeof current !== "object" || current === null) return undefined;
  return (current as Record<string, unknown>)[path.substring(start)];
}

/**
 * Sorts an array of objects by a specified property.
 *
 * @param params - The parameters object
 * @param params.array - The array to sort
 * @param params.key - The property to sort by (supports dot notation for nested properties)
 * @param params.order - Sort direction: "asc" (default) or "desc"
 * @returns A new sorted array (does not mutate the original)
 *
 * @example
 * ```ts
 * sortBy({ array: [{ age: 30 }, { age: 20 }], key: "age" });
 * // => [{ age: 20 }, { age: 30 }]
 * ```
 *
 * @throws Error if `array` is not an array
 * @throws Error if `key` is undefined or null
 */
function sortBy<T>({ array, key, order = "asc" }: SortByParams<T>): T[] {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (key === undefined || key === null) {
    throw new Error("The 'key' parameter is required");
  }

  const sorted = array.slice();
  const isDotted = typeof key === "string" && key.indexOf(".") !== -1;

  const sample =
    sorted.length > 0
      ? isDotted
        ? getByPath(sorted[0], key as string)
        : sorted[0][key as keyof T]
      : undefined;
  const isNumeric = typeof sample === "number";

  if (isNumeric && !isDotted) {
    const k = key as keyof T;
    if (order === "desc") {
      sorted.sort((a, b) => (b[k] as number) - (a[k] as number));
    } else {
      sorted.sort((a, b) => (a[k] as number) - (b[k] as number));
    }
  } else {
    const direction = order === "desc" ? -1 : 1;
    sorted.sort((a, b) => {
      const valA = (
        isDotted ? getByPath(a, key as string) : a[key as keyof T]
      ) as string | number;
      const valB = (
        isDotted ? getByPath(b, key as string) : b[key as keyof T]
      ) as string | number;

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  return sorted;
}

export { sortBy };
