import type { IsValidPhoneParams, IsValidPhoneResult } from "./types.js";

const PHONE_REGEX = /^\+[1-9]\d{0,14}$/;
const SEPARATORS_REGEX = /[\s\-().]/g;

const MAX_INPUT_LENGTH = 32;

/**
 * Checks whether a string is a well-formed E.164 international phone number.
 *
 * Requires a leading `+`, a non-zero country code, and 1–15 total digits
 * (E.164 maximum). Common readability separators — spaces, hyphens,
 * parentheses, and dots — are stripped before validation. Any other
 * character causes rejection.
 *
 * @param params - The parameters object
 * @param params.phone - The value to validate
 * @returns `true` if the value is a parseable E.164 phone number, `false` otherwise
 *
 * @example
 * ```ts
 * isValidPhone({ phone: "+5511999999999" });   // => true
 * isValidPhone({ phone: "+1 555 1234567" });   // => true
 * isValidPhone({ phone: "+44 (20) 7946-0958" }); // => true
 *
 * isValidPhone({ phone: "11999999999" });      // => false (no country code)
 * isValidPhone({ phone: "+0123456789" });      // => false (country code starts with 0)
 * isValidPhone({ phone: "abc" });              // => false
 * isValidPhone({ phone: "" });                 // => false
 * isValidPhone({ phone: null });               // => false
 * ```
 *
 * @keywords phone, validate phone, is phone, valid phone, phone number, e164, international
 *
 * @remarks
 * Non-string inputs (including `null`, `undefined`, numbers, and objects)
 * always return `false`. Empty strings return `false` without invoking the
 * regex.
 *
 * Inputs longer than 32 characters are rejected immediately to avoid
 * unbounded regex work on pathological input. E.164 caps at 15 digits +
 * `+` + reasonable separator slack, so 32 is a safe ceiling.
 *
 * Validation is structural only — it does not check whether the country
 * code, area code, or subscriber number actually exist. For carrier-grade
 * validation, use a library backed by phone metadata.
 */
function isValidPhone({ phone }: IsValidPhoneParams): IsValidPhoneResult {
  if (typeof phone !== "string") return false;
  if (phone.length === 0 || phone.length > MAX_INPUT_LENGTH) return false;

  const stripped = phone.replace(SEPARATORS_REGEX, "");
  return PHONE_REGEX.test(stripped);
}

export { isValidPhone };
