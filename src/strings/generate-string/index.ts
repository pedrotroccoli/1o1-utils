import type {
  Charset,
  GenerateStringParams,
  GenerateStringResult,
} from "./types.js";

const TWO_POW_32 = 0x1_0000_0000;
const MAX_LENGTH = 1_000_000;
const CRYPTO_BUFFER_LIMIT = 16384;

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const HEX = "0123456789abcdef";

const POOL_CHARS: Record<Exclude<Charset, "custom">, readonly string[]> = {
  all: [...(LOWER + UPPER + DIGITS + SYMBOLS)],
  alphanumeric: [...(LOWER + UPPER + DIGITS)],
  alpha: [...(LOWER + UPPER)],
  numeric: [...DIGITS],
  hex: [...HEX],
};

const VALID_CHARSETS = new Set<Charset>([
  "all",
  "alphanumeric",
  "alpha",
  "numeric",
  "hex",
  "custom",
]);

/**
 * Generates a cryptographically-secure random string of the given length using
 * a chosen character pool. Uses `crypto.getRandomValues` with rejection
 * sampling — no modulo bias, no `Math.random`, zero dependencies.
 *
 * @param params - The parameters object
 * @param params.length - The desired length of the output string. Integer in `[0, 1_000_000]`.
 * @param params.charset - The character pool to draw from. One of `all`
 * (default), `alphanumeric`, `alpha`, `numeric`, `hex`, or `custom`.
 * @param params.chars - Required when `charset === "custom"`. Pool of
 * characters to draw from. Iterated by Unicode code point, so emoji and
 * non-BMP characters count as one symbol.
 * @param params.dedupe - When `charset === "custom"`, collapse `chars` to its
 * unique code points (preserves first-seen order). Defaults to `false`.
 * @param params.minChars - When `charset === "custom"`, minimum number of
 * code points required in `chars` (counted after `dedupe` is applied). Must
 * be an integer ≥ 1. Defaults to `1`.
 * @returns A random string of the requested length (in code points)
 *
 * @example
 * ```ts
 * generateString({ length: 16 });
 * // => 'aB3$kL9mNx2&pQ7w'
 *
 * generateString({ length: 32, charset: "alphanumeric" });
 * // => 'aB3kL9mNx2pQ7wRt4jH6vY8cF1dG5eS0'
 *
 * generateString({ length: 12, charset: "hex" });
 * // => 'a3f1b9c2d4e7'
 *
 * generateString({ length: 8, charset: "numeric" });
 * // => '48291637'
 *
 * generateString({ length: 10, charset: "custom", chars: "ABC123" });
 * // => 'A1B3C2A1B3'
 * ```
 *
 * @keywords random, string, secure, crypto, token, password, nanoid, id, generate
 *
 * @throws Error if `length` is not an integer in `[0, 1_000_000]`
 * @throws Error if `charset` is not one of the allowed values
 * @throws Error if `chars`/`dedupe`/`minChars` are passed with a non-`custom` charset
 * @throws Error if `charset === "custom"` and `chars` is missing, not a string, or empty
 * @throws Error if `minChars` is not an integer ≥ 1
 * @throws Error if `dedupe` is not a boolean
 * @throws Error if the effective `chars` length is below `minChars`
 */
function generateString(params: GenerateStringParams): GenerateStringResult {
  const { length, charset = "all", chars, dedupe, minChars } = params;

  if (typeof length !== "number") {
    throw new Error("The 'length' parameter must be a number");
  }
  if (Number.isNaN(length)) {
    throw new Error("The 'length' parameter must not be NaN");
  }
  if (!Number.isInteger(length)) {
    throw new Error("The 'length' parameter must be an integer");
  }
  if (length < 0) {
    throw new Error("The 'length' parameter must be ≥ 0");
  }
  if (length > MAX_LENGTH) {
    throw new Error(`The 'length' parameter must not exceed ${MAX_LENGTH}`);
  }

  if (!VALID_CHARSETS.has(charset)) {
    throw new Error(
      "The 'charset' parameter must be one of: all, alphanumeric, alpha, numeric, hex, custom",
    );
  }

  let poolChars: readonly string[];

  if (charset === "custom") {
    if (typeof chars !== "string") {
      throw new Error(
        "The 'chars' parameter must be a string when charset is 'custom'",
      );
    }
    if (chars.length === 0) {
      throw new Error("The 'chars' parameter must not be empty");
    }
    if (dedupe !== undefined && typeof dedupe !== "boolean") {
      throw new Error("The 'dedupe' parameter must be a boolean");
    }
    if (minChars !== undefined) {
      if (typeof minChars !== "number") {
        throw new Error("The 'minChars' parameter must be a number");
      }
      if (!Number.isInteger(minChars) || minChars < 1) {
        throw new Error("The 'minChars' parameter must be an integer ≥ 1");
      }
    }

    const minCharsValue = minChars ?? 1;
    const codePoints = [...chars];
    poolChars = dedupe ? Array.from(new Set(codePoints)) : codePoints;

    if (poolChars.length < minCharsValue) {
      throw new Error(
        `The 'chars' parameter must contain at least ${minCharsValue} character(s)`,
      );
    }
  } else {
    if (chars !== undefined) {
      throw new Error(
        "The 'chars' parameter is only valid when charset is 'custom'",
      );
    }
    if (dedupe !== undefined) {
      throw new Error(
        "The 'dedupe' parameter is only valid when charset is 'custom'",
      );
    }
    if (minChars !== undefined) {
      throw new Error(
        "The 'minChars' parameter is only valid when charset is 'custom'",
      );
    }
    poolChars = POOL_CHARS[charset];
  }

  if (length === 0) return "";
  if (poolChars.length === 1) return poolChars[0].repeat(length);

  const poolSize = poolChars.length;
  const limit = Math.floor(TWO_POW_32 / poolSize) * poolSize;
  const bufSize = Math.min(length, CRYPTO_BUFFER_LIMIT);
  const buf = new Uint32Array(bufSize);
  const out = new Array<string>(length);

  let filled = 0;
  while (filled < length) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && filled < length; i++) {
      const v = buf[i];
      if (v < limit) {
        out[filled++] = poolChars[v % poolSize];
      }
    }
  }

  return out.join("");
}

export { generateString };
