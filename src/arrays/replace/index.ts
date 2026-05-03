import type { ReplaceParams, ReplaceResult } from "./types.js";

/**
 * Replaces element(s) in an array by predicate. Returns a new array; the
 * input is never mutated. By default, only the first matching item is
 * replaced; set `all: true` to replace every match.
 *
 * `value` accepts either a static replacement or an updater function
 * `(item, index) => newItem` that derives the new value from the matched
 * item. When no item matches, a shallow copy of the input is returned.
 *
 * @param params - The parameters object
 * @param params.array - The source array
 * @param params.predicate - Function called with `(item, index)` returning a boolean
 * @param params.value - Replacement value, or updater fn `(item, index) => newItem`
 * @param params.all - When `true`, replace every match; defaults to `false` (first only)
 * @returns A new array with matched items replaced
 *
 * @example
 * ```ts
 * const users = [{ id: 1, name: "Ana" }, { id: 2, name: "Bob" }];
 * replace({
 *   array: users,
 *   predicate: (u) => u.id === 2,
 *   value: { id: 2, name: "Bobby" },
 * });
 * // => [{ id: 1, name: "Ana" }, { id: 2, name: "Bobby" }]
 *
 * // Updater fn — derive replacement from current item
 * replace({
 *   array: [1, 2, 3, 2],
 *   predicate: (n) => n === 2,
 *   value: (n) => n * 10,
 *   all: true,
 * });
 * // => [1, 20, 3, 20]
 * ```
 *
 * @keywords replace, set, update, swap, replace-by, splice
 *
 * @throws Error if `array` is not an array
 * @throws Error if `predicate` is not a function
 * @throws Error if `value` is `undefined`
 *
 * @remarks
 * When `T` itself is a function type, `value` is detected as an updater via
 * `typeof value === "function"`. Pass an updater that returns the desired
 * function in that case.
 */
function replace<T>({
  array,
  predicate,
  value,
  all = false,
}: ReplaceParams<T>): ReplaceResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  if (typeof predicate !== "function") {
    throw new Error("The 'predicate' parameter must be a function");
  }

  if (value === undefined) {
    throw new Error("The 'value' parameter is required");
  }

  const isUpdater = typeof value === "function";
  const result: T[] = new Array(array.length);
  let replaced = false;

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if ((all || !replaced) && predicate(item, i)) {
      result[i] = isUpdater
        ? (value as (item: T, index: number) => T)(item, i)
        : (value as T);
      replaced = true;
    } else {
      result[i] = item;
    }
  }

  return result;
}

export { replace };
