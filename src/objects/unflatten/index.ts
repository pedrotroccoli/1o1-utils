import type { UnflattenParams } from "./types.js";

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

function isNumericSlice(str: string, start: number, end: number): boolean {
  if (end <= start) return false;
  for (let i = start; i < end; i++) {
    const c = str.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return true;
}

/**
 * Builds a nested object from a flat record of dot-notation keys. Inverse of
 * `flatten` for objects.
 *
 * @param params - The parameters object
 * @param params.obj - A flat record whose keys may contain `.` separators
 * @param params.arrays - When `true`, segments that are all-numeric reconstruct
 *   as arrays (e.g. `'a.0'`, `'a.1'` → `{ a: [...] }`). Defaults to `false`.
 * @returns A new nested object
 *
 * @example
 * ```ts
 * unflatten({ obj: { 'a.b': 1, 'a.c.d': 2, e: 3 } });
 * // => { a: { b: 1, c: { d: 2 } }, e: 3 }
 *
 * unflatten({ obj: { 'a.0': 'x', 'a.1': 'y' }, arrays: true });
 * // => { a: ['x', 'y'] }
 * ```
 *
 * @keywords nest, deep set, dot notation, construct, expand, inverse flatten
 *
 * @throws Error if `obj` is not a plain object
 */
function unflatten({
  obj,
  arrays = false,
}: UnflattenParams): Record<string, unknown> {
  if (!isPlainObject(obj)) {
    throw new Error("The 'obj' parameter is not an object");
  }

  const result: Record<string, unknown> = {};
  const keys = Object.keys(obj);

  for (let k = 0; k < keys.length; k++) {
    const fullKey = keys[k];
    const value = obj[fullKey];
    const len = fullKey.length;

    let dot = fullKey.indexOf(".");
    if (dot === -1) {
      if (UNSAFE_KEYS.has(fullKey)) continue;
      result[fullKey] = value;
      continue;
    }

    let current: Record<string, unknown> = result;
    let start = 0;
    let unsafe = false;

    while (dot !== -1) {
      const seg = fullKey.substring(start, dot);
      if (UNSAFE_KEYS.has(seg)) {
        unsafe = true;
        break;
      }

      const nextStart = dot + 1;
      const nextDot = fullKey.indexOf(".", nextStart);
      const nextEnd = nextDot === -1 ? len : nextDot;

      const existing = current[seg];
      let container: Record<string, unknown>;
      if (existing !== null && typeof existing === "object") {
        container = existing as Record<string, unknown>;
      } else {
        container = (
          arrays && isNumericSlice(fullKey, nextStart, nextEnd) ? [] : {}
        ) as Record<string, unknown>;
        current[seg] = container;
      }

      current = container;
      start = nextStart;
      dot = nextDot;
    }

    if (unsafe) continue;

    const last = fullKey.substring(start);
    if (UNSAFE_KEYS.has(last)) continue;
    current[last] = value;
  }

  return result;
}

export { unflatten };
