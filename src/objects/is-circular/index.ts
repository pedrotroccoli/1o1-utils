import type { IsCircularParams } from "./types.js";

function isLeaf(value: object): boolean {
  return (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Error ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

function collectChildren(obj: object): unknown[] {
  if (Array.isArray(obj)) return obj;
  if (obj instanceof Map) {
    const out: unknown[] = [];
    for (const [key, val] of obj) {
      out.push(key, val);
    }
    return out;
  }
  if (obj instanceof Set) return [...obj];
  return Object.values(obj as Record<string, unknown>);
}

/**
 * Detects whether a value contains a circular reference.
 *
 * Traverses plain objects, arrays, `Map` (keys and values), `Set`, and class
 * instances. Treats `Date`, `RegExp`, `Error`, `ArrayBuffer`, and typed arrays
 * as leaves (not traversed). Shared references that are not cyclic return
 * `false`.
 *
 * @param params - The parameters object
 * @param params.value - The value to inspect
 * @returns `true` if the reachable graph contains a cycle, `false` otherwise
 *
 * @example
 * ```ts
 * const obj: any = { a: 1 };
 * obj.self = obj;
 * isCircular({ value: obj });               // => true
 *
 * isCircular({ value: { a: { b: 1 } } });   // => false
 * isCircular({ value: [1, [2, [3]]] });     // => false
 * ```
 *
 * @keywords circular reference, cycle detection, infinite loop, recursive reference
 *
 * @see cloneDeep - safely clones values that may contain cycles
 */
function isCircular({ value }: IsCircularParams): boolean {
  if (value === null || typeof value !== "object") return false;

  const root = value as object;
  if (isLeaf(root)) return false;

  const ancestors = new WeakSet<object>();
  ancestors.add(root);

  type Frame = { node: object; children: unknown[]; index: number };
  const stack: Frame[] = [
    { node: root, children: collectChildren(root), index: 0 },
  ];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    if (frame.index >= frame.children.length) {
      ancestors.delete(frame.node);
      stack.pop();
      continue;
    }

    const child = frame.children[frame.index++];
    if (child === null || typeof child !== "object") continue;
    const childObj = child as object;
    if (isLeaf(childObj)) continue;
    if (ancestors.has(childObj)) return true;

    ancestors.add(childObj);
    stack.push({
      node: childObj,
      children: collectChildren(childObj),
      index: 0,
    });
  }

  return false;
}

export { isCircular };
