import type { DeburrParams, DeburrResult } from "./types.js";

/**
 * Removes diacritics (accents) from a string, preserving case and
 * non-accented characters.
 *
 * Useful for search, comparison, deduplication, and slug generation in
 * languages that use combining marks (Portuguese, Spanish, French,
 * Vietnamese, etc.).
 *
 * @param params - The parameters object
 * @param params.str - The string to deburr
 * @returns The string with combining diacritical marks removed
 *
 * @example
 * ```ts
 * deburr({ str: "café" });
 * // => "cafe"
 *
 * deburr({ str: "São Paulo" });
 * // => "Sao Paulo"
 *
 * deburr({ str: "résumé" });
 * // => "resume"
 * ```
 *
 * @keywords deburr, accent, diacritic, unicode, normalize, remove accents, strip accents, ascii
 *
 * @remarks
 * Uses Unicode NFD normalization to decompose accented characters into
 * their base letter plus combining marks, then strips marks in the
 * U+0300–U+036F range. Characters that do not decompose (e.g. German
 * `ß`, Turkish `ı`/`İ`, Polish `ł`) are left untouched — pair with a
 * locale-aware transliteration if you need broader coverage.
 *
 * @throws Error if `str` is not a string
 */
function deburr({ str }: DeburrParams): DeburrResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export { deburr };
