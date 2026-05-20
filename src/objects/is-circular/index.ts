import type { IsCircularParams } from "./types.js";

function isLeaf(value: object): boolean {
  return (
    typeof value === "function" ||
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Error ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

function* childrenOf(obj: object): Generator<unknown> {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) yield obj[i];
    return;
  }
  if (obj instanceof Map) {
    for (const [key, val] of obj) {
      yield key;
      yield val;
    }
    return;
  }
  if (obj instanceof Set) {
    for (const val of obj) yield val;
    return;
  }
  const record = obj as Record<string | symbol, unknown>;
  for (const key of Reflect.ownKeys(obj)) {
    yield record[key];
  }
}

/**
 * Detects whether a value contains a circular reference.
 *
 * Traverses plain objects, arrays, `Map` (keys and values), `Set`, and class
 * instances using every own property key (including non-enumerable and
 * `Symbol` keys). Treats functions, `Date`, `RegExp`, `Error`, `ArrayBuffer`,
 * and typed arrays as leaves (not traversed). Shared references that are not
 * cyclic return `false`.
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

  type Frame = { node: object; iter: Iterator<unknown> };
  const stack: Frame[] = [{ node: root, iter: childrenOf(root) }];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const next = frame.iter.next();
    if (next.done) {
      ancestors.delete(frame.node);
      stack.pop();
      continue;
    }

    const child = next.value;
    if (child === null || typeof child !== "object") continue;
    const childObj = child as object;
    if (isLeaf(childObj)) continue;
    if (ancestors.has(childObj)) return true;

    ancestors.add(childObj);
    stack.push({ node: childObj, iter: childrenOf(childObj) });
  }

  return false;
}

export { isCircular };
