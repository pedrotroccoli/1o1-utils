import type { DeepMergeParams, DeepMergeResult } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

/**
 * Recursively merges a source object into a target object.
 *
 * @param params - The parameters object
 * @param params.target - The base object
 * @param params.source - The object to merge into target
 * @returns A new merged object (inputs are not mutated)
 *
 * @example
 * ```ts
 * deepMerge({ target: { a: 1, b: { x: 10 } }, source: { b: { y: 20 }, c: 3 } });
 * // => { a: 1, b: { x: 10, y: 20 }, c: 3 }
 * ```
 *
 * @throws Error if `target` is not a plain object
 * @throws Error if `source` is not a plain object
 */
function deepMerge({ target, source }: DeepMergeParams): DeepMergeResult {
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

      if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
        const merged = Object.assign({}, targetVal);
        tgt[key] = merged;
        stack.push([merged, sourceVal]);
      } else {
        tgt[key] = sourceVal;
      }
    }
  }

  return result;
}

export { deepMerge };
