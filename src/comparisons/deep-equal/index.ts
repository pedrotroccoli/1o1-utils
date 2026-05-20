import type { DeepEqualParams, DeepEqualResult } from "./types.js";

const hasOwn = Object.prototype.hasOwnProperty;
const CYCLE_DEPTH = 20;

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  let len = a.length;
  if (len !== b.length) return false;
  while (len-- && a[len] === b[len]);
  return len === -1;
}

function equal(
  a: unknown,
  b: unknown,
  seen: WeakMap<object, WeakSet<object>> | null,
  depth: number,
): boolean {
  if (a === b) {
    if (a !== 0) return true;
    return 1 / (a as number) === 1 / (b as number);
  }
  // biome-ignore lint/suspicious/noSelfCompare: NaN check — faster than Number.isNaN in hot path
  if (a !== a && b !== b) return true;
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  const ctor = (a as { constructor?: unknown }).constructor;
  if (ctor !== (b as { constructor?: unknown }).constructor) return false;

  if (ctor === Date) {
    return (a as Date).getTime() === (b as Date).getTime();
  }
  if (ctor === RegExp) {
    return (
      (a as RegExp).source === (b as RegExp).source &&
      (a as RegExp).flags === (b as RegExp).flags
    );
  }
  if (ctor === Error) return false;

  if (ctor === ArrayBuffer) {
    return bytesEqual(
      new Uint8Array(a as ArrayBuffer),
      new Uint8Array(b as ArrayBuffer),
    );
  }

  if (ArrayBuffer.isView(a)) {
    const av = a as ArrayBufferView;
    const bv = b as ArrayBufferView;
    if (av.byteLength !== bv.byteLength) return false;
    return bytesEqual(
      new Uint8Array(av.buffer, av.byteOffset, av.byteLength),
      new Uint8Array(bv.buffer, bv.byteOffset, bv.byteLength),
    );
  }

  // Lazy cycle detection: allocate WeakMap only after depth threshold.
  // Cycles short-circuit once tracking is active; pre-threshold cycles still
  // unwind cheaply because the recursion will surpass the threshold quickly.
  const aObj = a as object;
  const bObj = b as object;
  if (seen === null && depth >= CYCLE_DEPTH) {
    seen = new WeakMap();
  }
  if (seen !== null) {
    const seenForA = seen.get(aObj);
    if (seenForA?.has(bObj)) return true;
    if (seenForA) {
      seenForA.add(bObj);
    } else {
      const ws = new WeakSet<object>();
      ws.add(bObj);
      seen.set(aObj, ws);
    }
  }

  const nextDepth = depth + 1;

  if (ctor === Array) {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    let len = arrA.length;
    if (len !== arrB.length) return false;
    while (len-- > 0) {
      if (!equal(arrA[len], arrB[len], seen, nextDepth)) return false;
    }
    return true;
  }

  if (ctor === Map) {
    const mapA = a as Map<unknown, unknown>;
    const mapB = b as Map<unknown, unknown>;
    if (mapA.size !== mapB.size) return false;
    let allPrimitiveKeys = true;
    for (const [k, v] of mapA) {
      if (k !== null && typeof k === "object") {
        allPrimitiveKeys = false;
        break;
      }
      if (!mapB.has(k)) return false;
      if (!equal(v, mapB.get(k), seen, nextDepth)) return false;
    }
    if (allPrimitiveKeys) return true;
    // Slow path: object keys present — greedy O(n²) match
    const usedB = new Set<unknown>();
    outer: for (const [k, v] of mapA) {
      if (k === null || typeof k !== "object") {
        if (mapB.has(k) && !usedB.has(k)) {
          if (!equal(v, mapB.get(k), seen, nextDepth)) return false;
          usedB.add(k);
          continue;
        }
      }
      for (const [kB, vB] of mapB) {
        if (usedB.has(kB)) continue;
        if (equal(k, kB, seen, nextDepth) && equal(v, vB, seen, nextDepth)) {
          usedB.add(kB);
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  if (ctor === Set) {
    const setA = a as Set<unknown>;
    const setB = b as Set<unknown>;
    if (setA.size !== setB.size) return false;
    let allPrimitive = true;
    for (const v of setA) {
      if (v !== null && typeof v === "object") {
        allPrimitive = false;
        break;
      }
      if (!setB.has(v)) return false;
    }
    if (allPrimitive) return true;
    const usedB = new Set<unknown>();
    outer: for (const v of setA) {
      if (v === null || typeof v !== "object") {
        if (setB.has(v) && !usedB.has(v)) {
          usedB.add(v);
          continue;
        }
      }
      for (const vB of setB) {
        if (usedB.has(vB)) continue;
        if (equal(v, vB, seen, nextDepth)) {
          usedB.add(vB);
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  // Plain object / class instance (same constructor)
  const aRec = a as Record<string, unknown>;
  const bRec = b as Record<string, unknown>;
  let count = 0;
  for (const key in aRec) {
    if (!hasOwn.call(aRec, key)) continue;
    count++;
    if (!hasOwn.call(bRec, key)) return false;
    if (!equal(aRec[key], bRec[key], seen, nextDepth)) return false;
  }
  let bCount = 0;
  for (const key in bRec) {
    if (hasOwn.call(bRec, key)) bCount++;
  }
  return count === bCount;
}

/**
 * Recursively compares two values for structural equality.
 *
 * Handles primitives, plain objects, class instances (same constructor),
 * arrays, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and typed arrays.
 * Circular references are tracked once recursion crosses an internal depth
 * threshold; on cycle, the pair is assumed equal. Functions, `Error`
 * instances, and other unsupported objects fall back to reference equality.
 *
 * Accepts either positional arguments `deepEqual(a, b)` or an object form
 * `deepEqual({ a, b })` for backward compatibility.
 *
 * @example
 * ```ts
 * deepEqual({ x: 1 }, { x: 1 });                                   // => true
 * deepEqual({ a: { x: 1 }, b: { x: 1 } });                         // => true
 * deepEqual([1, [2, 3]], [1, [2, 3]]);                             // => true
 * deepEqual(new Date(0), new Date(0));                             // => true
 * deepEqual(new Map([["x", 1]]), new Map([["x", 1]]));             // => true
 * deepEqual({ x: 1 }, { x: 2 });                                   // => false
 * ```
 *
 * @keywords deep equal, deep compare, structural equality, recursive equal, isEqual, value equality
 *
 * @see lodash isEqual (https://lodash.com/docs/4.17.15#isEqual)
 *
 * @remarks
 * Uses `===` with a `+0`/`-0` and `NaN` correction so `NaN` equals `NaN` and
 * `+0` is distinct from `-0`. Constructor identity discriminates types — a
 * plain object never equals a class instance with identical fields.
 * Symbol-keyed and non-enumerable properties are ignored. Map and Set
 * comparisons use a primitive fast path (`has`/`get`) and fall back to a
 * greedy O(n²) match when object keys/elements are present.
 */
const NO_SECOND_ARG = Symbol("noSecondArg");

function deepEqual(a: unknown, b: unknown): DeepEqualResult;
function deepEqual(params: DeepEqualParams): DeepEqualResult;
function deepEqual(
  aOrParams: unknown,
  maybeB: unknown = NO_SECOND_ARG,
): DeepEqualResult {
  if (maybeB !== NO_SECOND_ARG) {
    return equal(aOrParams, maybeB, null, 0);
  }
  const p = aOrParams as DeepEqualParams;
  return equal(p.a, p.b, null, 0);
}

export { deepEqual };
