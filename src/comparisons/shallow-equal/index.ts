import type { ShallowEqualParams, ShallowEqualResult } from "./types.js";

/**
 * Compares two values by their top-level entries using `Object.is`.
 *
 * Returns `true` when both values are strictly the same, or when they are
 * arrays/plain objects with identical own-enumerable entries at the first
 * level. Nested values are compared by reference, not structurally — use
 * `deepEqual` for recursive comparison.
 *
 * @param params - The parameters object
 * @param params.a - The first value to compare
 * @param params.b - The second value to compare
 * @returns `true` if the values are shallowly equal, `false` otherwise
 *
 * @example
 * ```ts
 * shallowEqual({ a: { x: 1, y: 2 }, b: { x: 1, y: 2 } });        // => true
 * shallowEqual({ a: { x: { n: 1 } }, b: { x: { n: 1 } } });      // => false (nested refs differ)
 * shallowEqual({ a: [1, 2, 3], b: [1, 2, 3] });                   // => true
 * shallowEqual({ a: Number.NaN, b: Number.NaN });                 // => true (Object.is)
 * ```
 *
 * @keywords shallow equal, shallow compare, shallow equality, props equal, state compare, memo compare
 *
 * @see React's `shallowEqual` (https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js)
 *
 * @remarks
 * Uses `Object.is` for primitive comparison, so `NaN` equals `NaN` and `+0`
 * is distinct from `-0`. Property comparison only runs for plain objects
 * (`Object.prototype` or null prototype) and arrays. Class instances, Maps,
 * Sets, Dates, RegExps and other built-ins fall back to reference equality.
 * Symbol-keyed and non-enumerable properties are ignored.
 *
 * For small objects (≤8 own keys), a linear key scan avoids the Set
 * allocation overhead; larger objects use a `Set` for O(1) membership
 * lookups. Both paths read only own enumerable keys via `Object.keys`,
 * so no prototype-chain leakage is possible.
 */
function shallowEqual({ a, b }: ShallowEqualParams): ShallowEqualResult {
  if (Object.is(a, b)) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  const aIsArray = Array.isArray(a);
  if (aIsArray !== Array.isArray(b)) return false;

  if (aIsArray) {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    if (arrA.length !== arrB.length) return false;
    for (let i = 0; i < arrA.length; i++) {
      if (!Object.is(arrA[i], arrB[i])) return false;
    }
    return true;
  }

  const protoA = Object.getPrototypeOf(a);
  if (protoA !== Object.getPrototypeOf(b)) return false;
  if (protoA !== Object.prototype && protoA !== null) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  const lenA = keysA.length;
  if (lenA !== keysB.length) return false;

  // Small objects: linear scan avoids Set allocation overhead.
  // Threshold chosen from benchmarks — below ~8 keys, O(n·m) scan beats
  // the constant cost of building a Set. Both paths read only own
  // enumerable string keys from Object.keys, so no prototype leak.
  if (lenA <= 8) {
    for (let i = 0; i < lenA; i++) {
      const key = keysA[i];
      if (keysB.indexOf(key) === -1) return false;
      if (!Object.is(objA[key], objB[key])) return false;
    }
    return true;
  }

  const keysBSet = new Set(keysB);
  for (let i = 0; i < lenA; i++) {
    const key = keysA[i];
    if (!keysBSet.has(key)) return false;
    if (!Object.is(objA[key], objB[key])) return false;
  }

  return true;
}

export { shallowEqual };
