import type { ToNumberParams, ToNumberResult } from "./types.js";

const separatorCache = new Map<string, string>();

function getDecimalSeparator(locale: string): string {
  const cached = separatorCache.get(locale);
  if (cached !== undefined) return cached;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  separatorCache.set(locale, decimal);
  return decimal;
}

/**
 * Extracts a numeric value from a string by stripping non-digit characters,
 * respecting the locale's decimal and group separators.
 *
 * Uses `Intl.NumberFormat` to determine the separators for the given locale.
 * Characters other than digits, the decimal separator, and a leading sign are removed.
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
function toNumber({ value, locale = "en-US" }: ToNumberParams): ToNumberResult {
  if (typeof value !== "string") {
    throw new TypeError("The 'value' parameter must be a string");
  }

  const decimalSep = getDecimalSeparator(locale);

  const firstDigitIdx = value.search(/\d/);
  const negative =
    firstDigitIdx > 0 && /[-−]/.test(value.slice(0, firstDigitIdx));

  let cleaned = "";
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") cleaned += ch;
    else if (ch === decimalSep) cleaned += ".";
  }

  if (cleaned === "" || cleaned === ".") {
    throw new Error(
      `The 'value' parameter must contain at least one digit (got: "${value}")`,
    );
  }

  const result = Number(cleaned);
  if (Number.isNaN(result)) {
    throw new Error(
      `Failed to parse "${value}" as a number with locale "${locale}"`,
    );
  }

  return negative ? -result : result;
}

export { toNumber };
