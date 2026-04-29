import type { DeepEqualParams, DeepEqualResult } from "./types.js";

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function equal(
  a: unknown,
  b: unknown,
  seen: WeakMap<object, WeakSet<object>>,
): boolean {
  if (Object.is(a, b)) return true;
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  const protoA = Object.getPrototypeOf(a);
  if (protoA !== Object.getPrototypeOf(b)) return false;

  const aObj = a as object;
  const bObj = b as object;
  let seenForA = seen.get(aObj);
  if (seenForA?.has(bObj)) return true;
  if (!seenForA) {
    seenForA = new WeakSet();
    seen.set(aObj, seenForA);
  }
  seenForA.add(bObj);

  if (a instanceof Date) return a.getTime() === (b as Date).getTime();

  if (a instanceof RegExp) {
    const rb = b as RegExp;
    return a.source === rb.source && a.flags === rb.flags;
  }

  if (a instanceof Error) return false;

  if (a instanceof ArrayBuffer) {
    const bb = b as ArrayBuffer;
    return bytesEqual(new Uint8Array(a), new Uint8Array(bb));
  }

  if (ArrayBuffer.isView(a)) {
    const av = a as ArrayBufferView;
    const bv = b as ArrayBufferView;
    if (av.byteLength !== bv.byteLength) return false;
    const ab = new Uint8Array(av.buffer, av.byteOffset, av.byteLength);
    const bbb = new Uint8Array(bv.buffer, bv.byteOffset, bv.byteLength);
    return bytesEqual(ab, bbb);
  }

  if (Array.isArray(a)) {
    const arrB = b as unknown[];
    if (a.length !== arrB.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!equal(a[i], arrB[i], seen)) return false;
    }
    return true;
  }

  if (a instanceof Map) {
    const mapB = b as Map<unknown, unknown>;
    if (a.size !== mapB.size) return false;
    const usedB = new Set<unknown>();
    outer: for (const [k, v] of a) {
      if (mapB.has(k) && !usedB.has(k)) {
        if (!equal(v, mapB.get(k), seen)) return false;
        usedB.add(k);
        continue;
      }
      for (const [kB, vB] of mapB) {
        if (usedB.has(kB)) continue;
        if (equal(k, kB, seen) && equal(v, vB, seen)) {
          usedB.add(kB);
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  if (a instanceof Set) {
    const setB = b as Set<unknown>;
    if (a.size !== setB.size) return false;
    const usedB = new Set<unknown>();
    outer: for (const v of a) {
      if (setB.has(v) && !usedB.has(v)) {
        usedB.add(v);
        continue;
      }
      for (const vB of setB) {
        if (usedB.has(vB)) continue;
        if (equal(v, vB, seen)) {
          usedB.add(vB);
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  const aRec = a as Record<string, unknown>;
  const bRec = b as Record<string, unknown>;
  const keysA = Object.keys(aRec);
  const lenA = keysA.length;
  if (lenA !== Object.keys(bRec).length) return false;
  for (let i = 0; i < lenA; i++) {
    const key = keysA[i];
    if (!Object.hasOwn(bRec, key)) return false;
    if (!equal(aRec[key], bRec[key], seen)) return false;
  }
  return true;
}

/**
 * Recursively compares two values for structural equality.
 *
 * Handles primitives, plain objects, class instances (same prototype), arrays,
 * `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and typed arrays. Circular
 * references are tracked with a `WeakMap` pair-cache; on cycle, the pair is
 * assumed equal. Functions, `Error` instances, and other unsupported objects
 * fall back to reference equality.
 *
 * @param params - The parameters object
 * @param params.a - The first value to compare
 * @param params.b - The second value to compare
 * @returns `true` if the values are deeply equal, `false` otherwise
 *
 * @example
 * ```ts
 * deepEqual({ a: { x: { n: 1 } }, b: { x: { n: 1 } } });           // => true
 * deepEqual({ a: [1, [2, 3]], b: [1, [2, 3]] });                   // => true
 * deepEqual({ a: new Date(0), b: new Date(0) });                   // => true
 * deepEqual({ a: new Map([["x", 1]]), b: new Map([["x", 1]]) });   // => true
 * deepEqual({ a: { x: 1 }, b: { x: 2 } });                         // => false
 * ```
 *
 * @keywords deep equal, deep compare, structural equality, recursive equal, isEqual, value equality
 *
 * @see lodash isEqual (https://lodash.com/docs/4.17.15#isEqual)
 *
 * @remarks
 * Uses `Object.is` for primitive comparison, so `NaN` equals `NaN` and `+0` is
 * distinct from `-0`. Same-prototype check runs before structural comparison —
 * a plain object never equals a class instance with identical fields.
 * Symbol-keyed and non-enumerable properties are ignored. Map and Set deep
 * comparisons use a greedy O(n²) match for elements not found by reference;
 * the result agrees with lodash for ordinary inputs.
 */
function deepEqual({ a, b }: DeepEqualParams): DeepEqualResult {
  return equal(a, b, new WeakMap<object, WeakSet<object>>());
}

export { deepEqual };
