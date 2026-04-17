import type { DefaultsDeepParams, DefaultsDeepResult } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

/**
 * Recursively assigns default values from `source` to `target`. For each
 * property, if the target's value is `undefined` (or the key is missing), the
 * source's value is used. When both target and source have plain objects at
 * the same key, they are merged recursively. Existing `null`, `0`, `""`,
 * `false`, and array values in the target are preserved.
 *
 * @param params - The parameters object
 * @param params.target - The base object whose defined values win
 * @param params.source - The object supplying defaults for missing keys
 * @returns A new object (inputs are not mutated)
 *
 * @example
 * ```ts
 * defaultsDeep({
 *   target: { db: { port: 5432 } },
 *   source: { db: { port: 3306, host: "localhost" }, debug: false },
 * });
 * // => { db: { port: 5432, host: "localhost" }, debug: false }
 * ```
 *
 * @keywords deep defaults, nested defaults, fill undefined recursive, fallback object deep
 *
 * @see lodash/defaultsDeep — semantic reference (https://lodash.com/docs/#defaultsDeep)
 *
 * @throws Error if `target` is not a plain object
 * @throws Error if `source` is not a plain object
 */
function defaultsDeep({
  target,
  source,
}: DefaultsDeepParams): DefaultsDeepResult {
  if (!isPlainObject(target)) {
    throw new Error("The 'target' parameter is not an object");
  }

  if (!isPlainObject(source)) {
    throw new Error("The 'source' parameter is not an object");
  }

  const result = Object.assign({}, target);

  const stack: [Record<string, unknown>, Record<string, unknown>][] = [
    [result, source],
  ];

  while (stack.length > 0) {
    const [tgt, src] = stack.pop()!;
    const sourceKeys = Object.keys(src);

    for (let i = 0; i < sourceKeys.length; i++) {
      const key = sourceKeys[i];
      const sourceVal = src[key];
      const targetVal = tgt[key];

      if (targetVal === undefined) {
        tgt[key] = sourceVal;
      } else if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        const copied = Object.assign({}, targetVal);
        tgt[key] = copied;
        stack.push([copied, sourceVal]);
      }
    }
  }

  return result;
}

export { defaultsDeep };
