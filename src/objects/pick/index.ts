import type { PickParams } from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function pickNested(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  key: string,
): void {
  const len = key.length;

  let src: unknown = source;
  let start = 0;
  let dot = key.indexOf(".");

  while (dot !== -1) {
    if (typeof src !== "object" || src === null) return;
    const seg = key.substring(start, dot);
    if (UNSAFE_KEYS.has(seg)) return;
    if (!Object.hasOwn(src, seg)) return;
    src = (src as Record<string, unknown>)[seg];
    start = dot + 1;
    dot = key.indexOf(".", start);
  }

  const lastSeg = key.substring(start, len);
  if (UNSAFE_KEYS.has(lastSeg)) return;
  if (typeof src !== "object" || src === null) return;
  if (!Object.hasOwn(src, lastSeg)) return;
  const value = (src as Record<string, unknown>)[lastSeg];

  let tgt = target;
  start = 0;
  dot = key.indexOf(".");

  while (dot !== -1) {
    const seg = key.substring(start, dot);
    if (tgt[seg] === undefined) {
      tgt[seg] = {};
    }
    tgt = tgt[seg] as Record<string, unknown>;
    start = dot + 1;
    dot = key.indexOf(".", start);
  }

  tgt[lastSeg] = value;
}

/**
 * Creates an object with only the specified keys.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.keys - Keys to include (supports dot notation for nested keys)
 * @returns A new object containing only the specified keys
 *
 * @example
 * ```ts
 * pick({ obj: { a: 1, b: 2, c: 3 }, keys: ["a", "c"] });
 * // => { a: 1, c: 3 }
 * ```
 *
 * @keywords select keys, extract properties, subset object, pluck
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `keys` is not an array
 */
function pick<T extends Record<string, unknown>>({
  obj,
  keys,
}: PickParams<T>): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (!Array.isArray(keys)) {
    throw new Error("The 'keys' parameter is not an array");
  }

  const result: Record<string, unknown> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as string;

    if (key.indexOf(".") === -1) {
      if (UNSAFE_KEYS.has(key)) continue;
      if (Object.hasOwn(obj, key)) {
        result[key] = obj[key];
      }
    } else {
      pickNested(obj, result, key);
    }
  }

  return result;
}

export { pick };
