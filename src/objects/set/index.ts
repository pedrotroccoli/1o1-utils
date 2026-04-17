import type { SetParams } from "./types.js";

function isNumericSegment(seg: string): boolean {
  if (seg.length === 0) return false;
  for (let i = 0; i < seg.length; i++) {
    const c = seg.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return true;
}

/**
 * Sets a nested value on an object using dot-notation path.
 * Non-mutating: returns a new object with only the nodes on the path cloned.
 *
 * @param params - The parameters object
 * @param params.obj - The source object
 * @param params.path - Dot-notation path (e.g. `"address.city"`)
 * @param params.value - The value to write at `path`
 * @param params.objectify - When `true`, numeric segments create plain objects
 *   with string keys instead of arrays. Defaults to `false`.
 * @returns A new object with `value` set at `path`
 *
 * @example
 * ```ts
 * set({ obj: { a: { b: 1 } }, path: "a.b", value: 2 });
 * // => { a: { b: 2 } }
 *
 * set({ obj: {}, path: "items.0.name", value: "x" });
 * // => { items: [{ name: "x" }] }
 *
 * set({ obj: {}, path: "items.0.name", value: "x", objectify: true });
 * // => { items: { "0": { name: "x" } } }
 * ```
 *
 * @keywords write nested, dot notation, deep set, property path, immutable set, lodash set
 *
 * @throws Error if `obj` is not an object
 * @throws Error if `path` is not a string
 * @throws Error if `path` is empty
 */
function set<T extends Record<string, unknown>>({
  obj,
  path,
  value,
  objectify,
}: SetParams<T>): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("The 'obj' parameter is not an object");
  }
  if (typeof path !== "string") {
    throw new Error("The 'path' parameter is not a string");
  }
  if (path.length === 0) {
    throw new Error("The 'path' parameter is an empty string");
  }

  const createArrays = objectify !== true;

  const segments: string[] = [];
  let start = 0;
  let dot = path.indexOf(".");
  while (dot !== -1) {
    segments.push(path.substring(start, dot));
    start = dot + 1;
    dot = path.indexOf(".", start);
  }
  segments.push(path.substring(start));

  const root: Record<string, unknown> | unknown[] = Array.isArray(obj)
    ? [...(obj as unknown[])]
    : { ...(obj as Record<string, unknown>) };

  let current: Record<string, unknown> = root as Record<string, unknown>;

  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    const nextSeg = segments[i + 1];
    const existing = current[seg];

    let cloned: Record<string, unknown> | unknown[];
    if (existing !== null && typeof existing === "object") {
      cloned = Array.isArray(existing)
        ? [...(existing as unknown[])]
        : { ...(existing as Record<string, unknown>) };
    } else {
      cloned = createArrays && isNumericSegment(nextSeg) ? [] : {};
    }

    current[seg] = cloned;
    current = cloned as Record<string, unknown>;
  }

  current[segments[segments.length - 1]] = value;
  return root as Record<string, unknown>;
}

export { set };
