import type { PickParams } from "./types.js";

function pickNested(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  key: string,
): void {
  const len = key.length;

  // pass 1: validate full path exists in source
  let src: unknown = source;
  let start = 0;
  let dot = key.indexOf(".");

  while (dot !== -1) {
    if (typeof src !== "object" || src === null) return;
    const seg = key.substring(start, dot);
    if (!(seg in (src as Record<string, unknown>))) return;
    src = (src as Record<string, unknown>)[seg];
    start = dot + 1;
    dot = key.indexOf(".", start);
  }

  const lastSeg = key.substring(start, len);
  if (typeof src !== "object" || src === null) return;
  if (!(lastSeg in (src as Record<string, unknown>))) return;
  const value = (src as Record<string, unknown>)[lastSeg];

  // pass 2: build target path and assign
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
      if (key in obj) {
        result[key] = obj[key];
      }
    } else {
      pickNested(obj, result, key);
    }
  }

  return result;
}

export { pick };
