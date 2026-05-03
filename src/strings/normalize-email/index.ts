import type {
  NormalizeEmailParams,
  NormalizeEmailResult,
} from "./types.js";

/**
 * Normalizes an email address: trim, lowercase, and optionally strip
 * plus-addressing (`+alias`).
 *
 * Plus-addressing (`user+tag@example.com`) resolves to the same mailbox
 * as `user@example.com` in most providers. Pass `stripPlus: true` to
 * collapse plus-tagged addresses to their base form, useful for
 * deduplicating emails.
 *
 * @param params - The parameters object
 * @param params.email - The email address to normalize
 * @param params.stripPlus - When `true`, drops everything from the first
 *   `+` in the local part up to the `@`. Default `false`.
 * @returns The normalized email address
 *
 * @example
 * ```ts
 * normalizeEmail({ email: "  User@Email.COM  " });
 * // => "user@email.com"
 *
 * normalizeEmail({
 *   email: "user+promotions@gmail.com",
 *   stripPlus: true,
 * });
 * // => "user@gmail.com"
 *
 * normalizeEmail({ email: "user+1@email.com" });
 * // => "user+1@email.com"
 * ```
 *
 * @keywords normalize email, email, lowercase email, dedupe email, plus addressing, strip plus
 *
 * @remarks
 * Lowercases both the local part and the domain. Per RFC 5321 the local
 * part is technically case-sensitive, but virtually every mail provider
 * treats it case-insensitively, so lowercasing is the practical default.
 *
 * Plus-stripping only touches the local part: a `+` that appears in the
 * domain is left untouched. When multiple `+` characters exist in the
 * local part, everything from the first `+` up to (but excluding) the
 * `@` is removed; the `@` and domain are preserved.
 *
 * No format validation is performed — pair with `isValidEmail` for that.
 *
 * @throws Error if `email` is not a string
 * @throws Error if `email` is empty after trimming
 */
function normalizeEmail({
  email,
  stripPlus = false,
}: NormalizeEmailParams): NormalizeEmailResult {
  if (typeof email !== "string") {
    throw new Error("The 'email' parameter must be a string");
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    throw new Error("The 'email' parameter must not be empty");
  }

  const lower = trimmed.toLowerCase();

  if (!stripPlus) return lower;

  const atIndex = lower.indexOf("@");
  if (atIndex < 0) return lower;

  const local = lower.slice(0, atIndex);
  const domain = lower.slice(atIndex);

  const plusIndex = local.indexOf("+");
  if (plusIndex < 0) return lower;

  return local.slice(0, plusIndex) + domain;
}

export { normalizeEmail };
