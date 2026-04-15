import type { IsEmptyParams } from "./types.js";

/**
 * Checks if a value is empty.
 *
 * A value is considered empty if it is: `null`, `undefined`, an empty string,
 * an empty array, an empty Map, an empty Set, or a plain object with no own
 * enumerable properties.
 *
 * @param params - The parameters object
 * @param params.value - The value to check
 * @returns `true` if the value is empty, `false` otherwise
 *
 * @example
 * ```ts
 * isEmpty({ value: {} });   // => true
 * isEmpty({ value: "" });   // => true
 * isEmpty({ value: [1] });  // => false
 * ```
 *
 * @keywords is empty, is blank, has value, null check, empty check
 */
function isEmpty({ value }: IsEmptyParams): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      for (const _ in value) return false;
      return true;
    }
  }

  return false;
}

export { isEmpty };
