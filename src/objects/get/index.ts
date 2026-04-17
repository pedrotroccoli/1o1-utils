import type { GetParams } from "./types.js";

/**
 * Reads a nested value from an object using dot-notation path.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.path - Dot-notation path (e.g. `"address.city"`)
 * @param params.defaultValue - Returned when the path does not resolve (default `undefined`)
 * @returns The value at `path`, or `defaultValue` if the path is unreachable
 *
 * @example
 * ```ts
 * get({ obj: { address: { city: "São Paulo" } }, path: "address.city" });
 * // => "São Paulo"
 *
 * get({ obj: { a: 1 }, path: "a.b", defaultValue: "BR" });
 * // => "BR"
 * ```
 *
 * @keywords read nested, dot notation, deep access, safe access, property path, lodash get
 */
function get<T>({ obj, path, defaultValue }: GetParams<T>): unknown {
  if (typeof path !== "string" || path.length === 0) return defaultValue;
  if (typeof obj !== "object" || obj === null) return defaultValue;

  let node: unknown = obj;
  let start = 0;
  let dot = path.indexOf(".");

  while (dot !== -1) {
    if (typeof node !== "object" || node === null) return defaultValue;
    const seg = path.substring(start, dot);
    if (!(seg in (node as Record<string, unknown>))) return defaultValue;
    node = (node as Record<string, unknown>)[seg];
    start = dot + 1;
    dot = path.indexOf(".", start);
  }

  if (typeof node !== "object" || node === null) return defaultValue;
  const lastSeg = path.substring(start);
  if (!(lastSeg in (node as Record<string, unknown>))) return defaultValue;

  const value = (node as Record<string, unknown>)[lastSeg];
  return value === undefined ? defaultValue : value;
}

export { get };
