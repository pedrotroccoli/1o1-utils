/**
 * Type guard: checks if a value is a primitive `string`.
 *
 * Narrows the argument to `string` in the calling scope. Returns `true`
 * only for primitive strings — boxed `String` objects (e.g.
 * `new String("x")`) return `false`, matching `typeof value === "string"`
 * semantics.
 *
 * Type guards are positional rather than using the named-object parameter
 * convention so that TypeScript can narrow the caller's variable in the
 * `if` branch.
 *
 * @param value - The value to check
 * @returns `true` if the value is a primitive string, `false` otherwise
 *
 * @example
 * ```ts
 * const value: unknown = "hello";
 * if (isString(value)) {
 *   // value is narrowed to string
 *   console.log(value.toUpperCase());
 * }
 *
 * isString("");                  // => true
 * isString("abc");               // => true
 * isString(123);                 // => false
 * isString(null);                // => false
 * isString(undefined);           // => false
 * isString(new String("boxed")); // => false
 * ```
 *
 * @keywords is string, type guard, type predicate, narrow string, typeof string
 */
function isString(value: unknown): value is string {
  return typeof value === "string";
}

export { isString };
