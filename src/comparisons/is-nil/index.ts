import type { IsNilParams, IsNilResult } from "./types.js";

/**
 * Checks if a value is `null` or `undefined`.
 *
 * Strict existence check — distinct from `isEmpty`, which also treats empty
 * strings, arrays, objects, Maps, and Sets as empty. `isNil` returns `true`
 * only for the two nullish values.
 *
 * @param params - The parameters object
 * @param params.value - The value to check
 * @returns `true` if the value is `null` or `undefined`, `false` otherwise
 *
 * @example
 * ```ts
 * isNil({ value: null });      // => true
 * isNil({ value: undefined }); // => true
 * isNil({ value: 0 });         // => false
 * isNil({ value: "" });        // => false
 * isNil({ value: false });     // => false
 * ```
 *
 * @keywords nil check, null check, undefined check, exists, is nullish, missing value, defined check
 */
function isNil({ value }: IsNilParams): IsNilResult {
  return value === null || value === undefined;
}

export { isNil };
