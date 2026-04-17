import type { DefaultsParams, DefaultsResult } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

/**
 * Assigns default values from `source` to `target` for properties that are
 * `undefined` or missing. Existing `null`, `0`, `""`, and `false` values are
 * preserved — only `undefined` triggers replacement.
 *
 * @param params - The parameters object
 * @param params.target - The base object whose defined values win
 * @param params.source - The object supplying defaults for missing keys
 * @returns A new object (inputs are not mutated)
 *
 * @example
 * ```ts
 * defaults({ target: { a: 1 }, source: { a: 99, b: 2 } });
 * // => { a: 1, b: 2 }
 * ```
 *
 * @keywords default values, fill undefined, fallback object, defaults, with defaults
 *
 * @see lodash/defaults — semantic reference (https://lodash.com/docs/#defaults)
 *
 * @throws Error if `target` is not a plain object
 * @throws Error if `source` is not a plain object
 */
function defaults({ target, source }: DefaultsParams): DefaultsResult {
  if (!isPlainObject(target)) {
    throw new Error("The 'target' parameter is not an object");
  }

  if (!isPlainObject(source)) {
    throw new Error("The 'source' parameter is not an object");
  }

  const result = Object.assign({}, target);
  const sourceKeys = Object.keys(source);

  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    if (result[key] === undefined) {
      result[key] = source[key];
    }
  }

  return result;
}

export { defaults };
