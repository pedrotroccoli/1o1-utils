import type { CapitalizeParams, CapitalizeResult } from "./types.js";

/**
 * Capitalizes the first character of a string.
 *
 * @param params - The parameters object
 * @param params.str - The string to capitalize
 * @param params.preserveRest - If true, keeps the rest as-is; if false (default), lowercases it
 * @returns The capitalized string
 *
 * @example
 * ```ts
 * capitalize({ str: "hello" });
 * // => "Hello"
 * ```
 *
 * @keywords uppercase first, first letter uppercase, initial cap
 *
 * @throws Error if `str` is not a string
 */
function capitalize({
  str,
  preserveRest = false,
}: CapitalizeParams): CapitalizeResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (str.length === 0) return "";

  if (preserveRest) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const lowered = str.toLowerCase();
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

export { capitalize };
