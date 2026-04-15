import type { OmitParams } from "./types.js";

function omitNested(target: Record<string, unknown>, key: string): void {
  const len = key.length;

  let node: unknown = target;
  let start = 0;
  let dot = key.indexOf(".");

  const segments: string[] = [];

  while (dot !== -1) {
    const seg = key.substring(start, dot);
    segments.push(seg);
    if (typeof node !== "object" || node === null) return;
    if (!(seg in (node as Record<string, unknown>))) return;
    node = (node as Record<string, unknown>)[seg];
    start = dot + 1;
    dot = key.indexOf(".", start);
  }

  const lastSeg = key.substring(start, len);
  if (typeof node !== "object" || node === null) return;
  if (!(lastSeg in (node as Record<string, unknown>))) return;

  let tgt = target;
  for (const seg of segments) {
    const cloned = Object.assign({}, tgt[seg] as Record<string, unknown>);
    tgt[seg] = cloned;
    tgt = cloned;
  }

  delete tgt[lastSeg];
}

/**
 * Creates an object with the specified keys removed.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.keys - Keys to exclude (supports dot notation for nested keys)
 * @returns A new object without the specified keys
 *
 * @example
 * ```ts
 * omit({ obj: { a: 1, b: 2, c: 3 }, keys: ["b", "c"] });
 * // => { a: 1 }
 * ```
 *
 * @keywords exclude keys, remove properties, without keys, strip fields
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `keys` is not an array
 */
function omit<T extends Record<string, unknown>>({
  obj,
  keys,
}: OmitParams<T>): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }

  if (!Array.isArray(keys)) {
    throw new Error("The 'keys' parameter is not an array");
  }

  let hasNested = false;
  const keyMap: Record<string, true> = Object.create(null);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as string;
    keyMap[key] = true;
    if (!hasNested && key.indexOf(".") !== -1) {
      hasNested = true;
    }
  }

  const objKeys = Object.keys(obj);
  const result: Record<string, unknown> = {};
  for (let i = 0; i < objKeys.length; i++) {
    const k = objKeys[i];
    if (keyMap[k] === undefined) {
      result[k] = obj[k];
    }
  }

  if (hasNested) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as string;
      if (key.indexOf(".") !== -1) {
        omitNested(result, key);
      }
    }
  }

  return result;
}

export { omit };
