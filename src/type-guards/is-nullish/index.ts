/**
 * Type guard: checks if a value is `null` or `undefined`.
 *
 * Narrows the argument to `null | undefined` in the truthy branch — and,
 * by symmetry, removes both from the type in the `else` branch. Useful
 * for guarding optional/maybe values where `0`, `""`, and `false` should
 * be kept.
 *
 * For a non-narrowing equivalent that follows the named-object parameter
 * convention, see [`isNil`](../../comparisons/is-nil/index.js).
 *
 * Type guards are positional rather than using the named-object parameter
 * convention so that TypeScript can narrow the caller's variable in the
 * `if` branch.
 *
 * @param value - The value to check
 * @returns `true` if the value is `null` or `undefined`, `false` otherwise
 *
 * @example
 * ```ts
 * const value: string | null | undefined = maybeString();
 * if (isNullish(value)) {
 *   // value is narrowed to null | undefined
 *   return "missing";
 * }
 * // value is narrowed to string
 * return value.toUpperCase();
 *
 * isNullish(null);      // => true
 * isNullish(undefined); // => true
 * isNullish(0);         // => false
 * isNullish("");        // => false
 * isNullish(false);     // => false
 * isNullish(Number.NaN); // => false
 * ```
 *
 * @keywords is nullish, type guard, type predicate, narrow nullish, null check, undefined check, nullish coalescing
 */
function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export { isNullish };
