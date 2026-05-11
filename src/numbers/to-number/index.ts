import type { ToNumber, ToNumberParams, ToNumberResult } from "./types.js";

const SEPARATOR_CACHE_MAX = 32;
const separatorCache = new Map<string, string>();

function getDecimalSeparator(locale: string): string {
  const cached = separatorCache.get(locale);
  if (cached !== undefined) return cached;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  if (separatorCache.size >= SEPARATOR_CACHE_MAX) {
    const oldest = separatorCache.keys().next().value;
    if (oldest !== undefined) separatorCache.delete(oldest);
  }
  separatorCache.set(locale, decimal);
  return decimal;
}

function safeQuote(input: string): string {
  return JSON.stringify(input.length > 64 ? `${input.slice(0, 64)}…` : input);
}

/**
 * Extracts a numeric value from a string by stripping non-digit characters,
 * respecting the locale's decimal and group separators.
 *
 * Uses `Intl.NumberFormat` to determine the separators for the given locale.
 * Characters other than ASCII digits (`0`–`9`), the decimal separator, and a
 * leading sign are removed. Non-ASCII digit scripts (Arabic-Indic, Devanagari,
 * etc.) and scientific notation (`1e5`) are not supported — see edge cases in
 * the docs.
 *
 * @param params - The parameters object
 * @param params.value - The string to parse
 * @param params.locale - BCP 47 locale tag controlling decimal/group separators. Defaults to `"en-US"`
 * @returns The numeric value parsed from `value`
 *
 * @example
 * ```ts
 * toNumber({ value: "R$ 1.500,00", locale: "pt-BR" }); // 1500
 * toNumber({ value: "12.5" });                          // 12.5
 * toNumber({ value: "123abc456" });                     // 123456
 * toNumber({ value: "-1,234.56" });                     // -1234.56
 * ```
 *
 * @keywords parse-number, to-number, numeric-extract, strip-digits, currency-parse, locale, intl
 *
 * @throws TypeError if `value` is not a string
 * @throws Error if `value` contains no digits or cannot be parsed as a number
 */
const toNumber: ToNumber = ({
  value,
  locale = "en-US",
}: ToNumberParams): ToNumberResult => {
  if (typeof value !== "string") {
    throw new TypeError("The 'value' parameter must be a string");
  }

  const decimalSep = getDecimalSeparator(locale);

  const firstDigitIdx = value.search(/[0-9]/);
  const negative =
    firstDigitIdx > 0 && /[-−]/.test(value.slice(0, firstDigitIdx));

  let cleaned = "";
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") cleaned += ch;
    else if (ch === decimalSep) cleaned += ".";
  }

  if (cleaned === "" || cleaned === ".") {
    throw new Error(
      `The 'value' parameter must contain at least one digit (got: ${safeQuote(value)})`,
    );
  }

  const result = Number(cleaned);
  if (Number.isNaN(result)) {
    throw new Error(
      `Failed to parse ${safeQuote(value)} as a number with locale ${safeQuote(locale)}`,
    );
  }

  return negative ? -result : result;
};

export { toNumber };
