import type {
  FlattenArrayParams,
  FlattenObjectParams,
  FlattenParams,
} from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

function flattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const seen = new WeakSet<object>();
  seen.add(obj);
  const stack: [Record<string, unknown>, string][] = [[obj, ""]];

  while (stack.length > 0) {
    const entry = stack.pop();
    if (!entry) break;
    const [current, prefix] = entry;
    const keys = Object.keys(current);
    const hasPrefix = prefix.length !== 0;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (UNSAFE_KEYS.has(key)) continue;

      const value = current[key];
      const newKey = hasPrefix ? `${prefix}.${key}` : key;

      if (isPlainObject(value)) {
        if (seen.has(value)) {
          throw new Error(
            "Circular reference detected while flattening object",
          );
        }
        const subKeys = Object.keys(value);
        if (subKeys.length === 0) {
          result[newKey] = {};
        } else {
          seen.add(value);
          stack.push([value, newKey]);
        }
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

/**
 * Flattens a nested structure.
 *
 * - Array input: deep flatten to `depth` (default `Infinity`).
 * - Plain object input: produces a flat record with dot-notation keys.
 *   Only plain objects are descended into; arrays, Date, RegExp, Map, Set,
 *   and class instances are treated as leaves.
 *
 * Leaf values (and array values inside objects) are shared by reference with
 * the input — `flatten` does not deep-clone leaves.
 *
 * @param params - The parameters object
 * @param params.value - The array or plain object to flatten
 * @param params.depth - Max recursion depth (arrays only). Defaults to `Infinity`.
 * @returns A flat array (when `value` is an array) or a flat record with
 *   dot-notation keys (when `value` is a plain object).
 *
 * @example
 * ```ts
 * flatten({ value: [1, [2, [3, [4]]]] });
 * // => [1, 2, 3, 4]
 *
 * flatten({ value: [1, [2, [3]]], depth: 1 });
 * // => [1, 2, [3]]
 *
 * flatten({ value: { a: { b: 1, c: { d: 2 } }, e: 3 } });
 * // => { 'a.b': 1, 'a.c.d': 2, e: 3 }
 * ```
 *
 * @keywords flat, deep flatten, dot notation, nested keys, crush, flatten object
 *
 * @throws Error if `value` is null, primitive, or anything other than an
 *   array or plain object.
 * @throws Error if a circular reference is detected during object flattening.
 */
function flatten(params: FlattenArrayParams): unknown[];
function flatten(params: FlattenObjectParams): Record<string, unknown>;
function flatten({
  value,
  depth,
}: FlattenParams): unknown[] | Record<string, unknown> {
  if (Array.isArray(value)) {
    const d = depth ?? Number.POSITIVE_INFINITY;
    return value.flat(d);
  }

  if (isPlainObject(value)) {
    return flattenObject(value);
  }

  throw new Error("The 'value' parameter is not an array or plain object");
}

export { flatten };
