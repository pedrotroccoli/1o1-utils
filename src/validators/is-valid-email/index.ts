import type { IsValidEmailParams, IsValidEmailResult } from "./types.js";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const DISPLAY_NAME_REGEX = /^\s*(?:"([^"]*)"|([^<"]+?))\s*<([^>]+)>\s*$/;

const MAX_TOTAL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;
const MAX_INPUT_LENGTH = 320;

/**
 * Checks whether a string is a well-formed email address.
 *
 * Uses the HTML5 living-standard email pattern (the same regex browsers
 * use for `<input type="email">`) plus RFC 5321 length limits (local
 * part ≤64, total ≤254). Pragmatic over RFC 5322 strict — accepts the
 * addresses people actually use.
 *
 * @param params - The parameters object
 * @param params.email - The value to validate
 * @param params.allowDisplayName - When `true`, accepts addresses
 *   wrapped in display-name form like `"Name <user@example.com>"` or
 *   `'"Quoted Name" <user@example.com>'`. The bracketed address is
 *   extracted and validated. Default `false`.
 * @returns `true` if the value is a parseable email, `false` otherwise
 *
 * @example
 * ```ts
 * isValidEmail({ email: "user@example.com" });        // => true
 * isValidEmail({ email: "user+tag@gmail.com" });      // => true
 * isValidEmail({ email: "first.last@sub.example.io" }); // => true
 *
 * isValidEmail({ email: "invalid@" });                // => false
 * isValidEmail({ email: "no-at-sign.com" });          // => false
 * isValidEmail({ email: "" });                        // => false
 * isValidEmail({ email: null });                      // => false
 *
 * // Display-name form (opt-in)
 * isValidEmail({
 *   email: "Jane Doe <jane@example.com>",
 *   allowDisplayName: true,
 * }); // => true
 * ```
 *
 * @keywords email, validate email, is email, valid email, email check, email validator
 *
 * @remarks
 * Non-string inputs (including `null`, `undefined`, numbers, and
 * objects) always return `false`. Empty strings return `false` without
 * invoking the regex. The validator is deliberately structural and does
 * not perform DNS, MX, or SMTP checks.
 *
 * Inputs longer than 320 characters (RFC 5321 maximum address size) are
 * rejected immediately to avoid unbounded regex work on pathological
 * input.
 *
 * The host part is ASCII-only — internationalized domain names (IDN)
 * such as `user@münchen.de` return `false`. Convert IDN hosts to their
 * Punycode form (`user@xn--mnchen-3ya.de`) before validating if needed.
 *
 * Consecutive dots in the local part (e.g., `a..b@example.com`) are
 * accepted, matching the HTML5 living standard. RFC 5322 strict
 * disallows them; this validator favors HTML5 compatibility.
 */
function isValidEmail({
  email,
  allowDisplayName = false,
}: IsValidEmailParams): IsValidEmailResult {
  if (typeof email !== "string") return false;
  if (email.length === 0 || email.length > MAX_INPUT_LENGTH) return false;

  let addr = email;
  if (allowDisplayName) {
    const match = DISPLAY_NAME_REGEX.exec(email);
    if (match !== null) addr = match[3] ?? "";
  }

  if (addr.length === 0 || addr.length > MAX_TOTAL_LENGTH) return false;

  const atIndex = addr.indexOf("@");
  if (atIndex < 0 || atIndex > MAX_LOCAL_LENGTH) return false;

  return EMAIL_REGEX.test(addr);
}

export { isValidEmail };
