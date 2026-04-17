import type { CloneDeepParams, CloneDeepResult } from "./types.js";

function createShallowClone(value: object): unknown {
  if (Array.isArray(value)) return new Array(value.length);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) return new Map();
  if (value instanceof Set) return new Set();
  if (value instanceof Error) {
    const err = new (value.constructor as ErrorConstructor)(value.message);
    err.stack = value.stack;
    return err;
  }
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (ArrayBuffer.isView(value)) {
    const ta = value as {
      constructor: new (buffer: ArrayBuffer) => ArrayBufferView;
      buffer: ArrayBuffer;
      byteOffset: number;
      byteLength: number;
    };
    return new ta.constructor(
      ta.buffer.slice(ta.byteOffset, ta.byteOffset + ta.byteLength),
    );
  }
  if (Object.getPrototypeOf(value) === null) return Object.create(null);
  return {};
}

function isLeaf(value: object): boolean {
  return (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
}

function processValue(
  val: unknown,
  seen: WeakMap<object, object>,
  stack: { source: object; clone: object }[],
): unknown {
  if (val === null || typeof val !== "object") return val;
  const obj = val as object;
  if (seen.has(obj)) return seen.get(obj);
  const cloned = createShallowClone(obj);
  seen.set(obj, cloned as object);
  if (!isLeaf(obj)) {
    stack.push({ source: obj, clone: cloned as object });
  }
  return cloned;
}

/**
 * Creates a deep clone of a value.
 *
 * Handles plain objects, arrays, dates, regexes, maps, sets, typed arrays,
 * array buffers, errors, and circular references. Functions are copied by reference.
 *
 * @param params - The parameters object
 * @param params.value - The value to deep clone
 * @returns A deep clone of the value
 *
 * @example
 * ```ts
 * const original = { a: { b: [1, 2] }, date: new Date() };
 * const cloned = cloneDeep({ value: original });
 *
 * cloned.a.b.push(3);
 * original.a.b; // [1, 2] — unaffected
 * ```
 *
 * @keywords deep clone, deep copy, clone object, copy object, structuredClone alternative
 *
 * @see structuredClone - native alternative that fails on classes, functions, and DOM nodes
 */
function cloneDeep<T>({ value }: CloneDeepParams<T>): CloneDeepResult<T> {
  if (value === null || typeof value !== "object") return value;

  const seen = new WeakMap<object, object>();
  const root = createShallowClone(value as object);
  seen.set(value as object, root as object);

  if (isLeaf(value as object)) return root as T;

  const stack: { source: object; clone: object }[] = [
    { source: value as object, clone: root as object },
  ];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) break;
    const { source, clone } = item;

    if (source instanceof Map) {
      const cloneMap = clone as Map<unknown, unknown>;
      for (const [key, val] of source) {
        cloneMap.set(key, processValue(val, seen, stack));
      }
    } else if (source instanceof Set) {
      const cloneSet = clone as Set<unknown>;
      for (const val of source) {
        cloneSet.add(processValue(val, seen, stack));
      }
    } else if (Array.isArray(source)) {
      const cloneArr = clone as unknown[];
      for (let i = 0; i < source.length; i++) {
        if (!(i in source)) continue;
        cloneArr[i] = processValue(source[i], seen, stack);
      }
    } else {
      const cloneObj = clone as Record<string, unknown>;
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        cloneObj[key] = processValue(
          (source as Record<string, unknown>)[key],
          seen,
          stack,
        );
      }
    }
  }

  return root as T;
}

export { cloneDeep };
