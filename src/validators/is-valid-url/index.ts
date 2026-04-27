import type { IsValidUrlParams, IsValidUrlResult } from "./types.js";

/**
 * Checks whether a value is a well-formed URL string.
 *
 * Delegates parsing to the WHATWG `URL` API — the same parser used by
 * browsers and Node — so any scheme accepted by `new URL(input)` is
 * considered valid by default (including `http`, `https`, `ftp`, `file`,
 * and custom schemes). Pass `protocols` to restrict the accepted scheme
 * set.
 *
 * @param params - The parameters object
 * @param params.url - The value to validate
 * @param params.protocols - Optional allowlist of accepted protocols
 *   (e.g. `"https"` or `["http", "https"]`). Names are matched
 *   case-insensitively. A trailing `:` is accepted but not required, so
 *   `"https"` and `"https:"` (or `url.protocol` from a `URL` instance)
 *   are equivalent.
 * @returns `true` if the value is a parseable URL whose protocol is
 *   accepted, `false` otherwise
 *
 * @example
 * ```ts
 * isValidUrl({ url: "https://example.com" });        // => true
 * isValidUrl({ url: "http://localhost:3000" });      // => true
 * isValidUrl({ url: "ftp://files.example.com" });    // => true
 * isValidUrl({ url: "not-a-url" });                  // => false
 * isValidUrl({ url: "" });                           // => false
 *
 * // Restrict accepted protocols
 * isValidUrl({ url: "https://example.com", protocols: ["http", "https"] }); // => true
 * isValidUrl({ url: "ftp://example.com",   protocols: ["http", "https"] }); // => false
 * isValidUrl({ url: "https://example.com", protocols: "https" });           // => true
 * ```
 *
 * @keywords url, validate url, is url, valid url, url check, parse url, protocol, scheme
 *
 * @see [WHATWG URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
 *
 * @remarks
 * Non-string inputs (including `null`, `undefined`, numbers, and objects)
 * always return `false`. Empty strings return `false` without invoking
 * the parser. When `protocols` is omitted and `URL.canParse` is
 * available, `URL.canParse` is used to avoid the cost of throwing on
 * invalid input; otherwise a `try/catch` around `new URL(input)` is
 * used.
 *
 * `protocols: []` rejects every input — no scheme can match an empty
 * allowlist. Protocol names are lowercased and any trailing `:` is
 * stripped before comparison, so `["HTTPS"]`, `["https"]`, and
 * `["https:"]` all match `https://...`.
 *
 * Protocol-relative URLs (`//example.com`) and bare authority strings
 * are not accepted — a scheme is required, matching `URL` constructor
 * behavior.
 */
function isValidUrl({ url, protocols }: IsValidUrlParams): IsValidUrlResult {
  if (typeof url !== "string") return false;
  if (url.length === 0) return false;

  if (protocols === undefined) {
    if (typeof URL.canParse === "function") return URL.canParse(url);
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  const list = typeof protocols === "string" ? [protocols] : protocols;
  const scheme = normalizeScheme(parsed.protocol);
  for (const p of list) {
    if (typeof p === "string" && normalizeScheme(p) === scheme) return true;
  }
  return false;
}

function normalizeScheme(scheme: string): string {
  const lower = scheme.toLowerCase();
  return lower.endsWith(":") ? lower.slice(0, -1) : lower;
}

export { isValidUrl };
