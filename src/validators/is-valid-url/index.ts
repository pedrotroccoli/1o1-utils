import type { IsValidUrlParams, IsValidUrlResult } from "./types.js";

/**
 * Checks whether a value is a well-formed URL string.
 *
 * Delegates parsing to the WHATWG `URL` API — the same parser used by
 * browsers and Node — so any scheme accepted by `new URL(input)` is
 * considered valid (including `http`, `https`, `ftp`, `file`, and
 * custom schemes).
 *
 * @param params - The parameters object
 * @param params.url - The value to validate
 * @returns `true` if the value is a parseable URL, `false` otherwise
 *
 * @example
 * ```ts
 * isValidUrl({ url: "https://example.com" });        // => true
 * isValidUrl({ url: "http://localhost:3000" });      // => true
 * isValidUrl({ url: "ftp://files.example.com" });    // => true
 * isValidUrl({ url: "not-a-url" });                  // => false
 * isValidUrl({ url: "" });                           // => false
 * ```
 *
 * @keywords url, validate url, is url, valid url, url check, parse url
 *
 * @see [WHATWG URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
 *
 * @remarks
 * Non-string inputs (including `null`, `undefined`, numbers, and objects)
 * always return `false`. Empty and whitespace-only strings return `false`
 * without invoking the parser. When available, `URL.canParse` is used to
 * avoid the cost of throwing on invalid input; otherwise a `try/catch`
 * around `new URL(input)` is used as a fallback.
 *
 * Protocol-relative URLs (`//example.com`) and bare authority strings are
 * not accepted — a scheme is required, matching `URL` constructor
 * behavior.
 */
function isValidUrl({ url }: IsValidUrlParams): IsValidUrlResult {
  if (typeof url !== "string") return false;
  if (url.length === 0) return false;

  if (typeof URL.canParse === "function") return URL.canParse(url);

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export { isValidUrl };
