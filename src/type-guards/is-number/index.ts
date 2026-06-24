/**
 * Type guard: checks if a value is a primitive `number`.
 *
 * Narrows the argument to `number` in the calling scope. Matches
 * `typeof value === "number"` semantics, which means `NaN`, `Infinity`,
 * and `-Infinity` return `true`. Boxed `Number` objects (e.g.
 * `new Number(1)`) and `bigint` values return `false`.
 *
 * Use `Number.isFinite` or `Number.isInteger` afterwards if you need to
 * rule out `NaN`/`Infinity` or restrict to integers.
 *
 * Type guards are positional rather than using the named-object parameter
 * convention so that TypeScript can narrow the caller's variable in the
 * `if` branch.
 *
 * @param value - The value to check
 * @returns `true` if the value is a primitive number, `false` otherwise
 *
 * @example
 * ```ts
 * const value: unknown = 42;
 * if (isNumber(value)) {
 *   // value is narrowed to number
 *   console.log(value.toFixed(2));
 * }
 *
 * isNumber(0);                  // => true
 * isNumber(-1.5);               // => true
 * isNumber(Number.NaN);         // => true
 * isNumber(Number.POSITIVE_INFINITY); // => true
 * isNumber("1");                // => false
 * isNumber(1n);                 // => false
 * isNumber(new Number(1));      // => false
 * isNumber(null);               // => false
 * ```
 *
 * @keywords is number, type guard, type predicate, narrow number, typeof number
 */
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export { isNumber };
