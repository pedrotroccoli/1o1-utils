import type { TruncateParams, TruncateResult } from "./types.js";

/**
 * Truncates a string to a specified length with an optional suffix.
 *
 * @param params - The parameters object
 * @param params.str - The string to truncate
 * @param params.length - Maximum length (positive integer)
 * @param params.suffix - String appended when truncated (default: "...")
 * @returns The truncated string, or the original if shorter than `length`
 *
 * @example
 * ```ts
 * truncate({ str: "Hello, World!", length: 5 });
 * // => "Hello..."
 * ```
 *
 * @keywords shorten text, ellipsis, cut string, text overflow
 *
 * @throws Error if `str` is not a string
 * @throws Error if `length` is not a positive integer
 */
function truncate({
  str,
  length,
  suffix = "...",
}: TruncateParams): TruncateResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (typeof length !== "number" || length <= 0 || !Number.isInteger(length)) {
    throw new Error("The 'length' parameter must be a positive integer");
  }

  if (str.length <= length) {
    return str;
  }

  return str.slice(0, length) + suffix;
}

export { truncate };
