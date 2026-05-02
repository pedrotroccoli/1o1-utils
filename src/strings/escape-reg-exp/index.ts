import type { EscapeRegExpParams, EscapeRegExpResult } from "./types.js";

const SPECIAL = /[.*+?^${}()|[\]\\]/g;

/**
 * Escapes regex special characters in a string so it can be safely interpolated
 * into a `RegExp`. Prevents regex injection when user input is used in a pattern.
 *
 * @param params - The parameters object
 * @param params.str - The string to escape
 * @returns The string with regex metacharacters escaped
 *
 * @example
 * ```ts
 * escapeRegExp({ str: "[hello](world)" });
 * // => "\\[hello\\]\\(world\\)"
 *
 * new RegExp(escapeRegExp({ str: userInput }), "i");
 * ```
 *
 * @keywords escape regex, regex injection, escape pattern, safe regex
 *
 * @throws Error if `str` is not a string
 */
function escapeRegExp({ str }: EscapeRegExpParams): EscapeRegExpResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  return str.replace(SPECIAL, "\\$&");
}

export { escapeRegExp };
