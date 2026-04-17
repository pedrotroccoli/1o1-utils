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

  const keys = path.split(".");
  let node: unknown = obj;
  for (let i = 0; i < keys.length; i++) {
    if (node === null || typeof node !== "object") return defaultValue;
    node = (node as Record<string, unknown>)[keys[i]];
  }
  return node === undefined ? defaultValue : node;
}

export { get };
