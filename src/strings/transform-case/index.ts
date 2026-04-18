import type {
  CaseStyle,
  TransformCaseParams,
  TransformCaseResult,
} from "./types.js";

const VALID_STYLES = new Set<CaseStyle>([
  "camel",
  "kebab",
  "snake",
  "pascal",
  "title",
]);

function splitWords(str: string): string[] {
  // Insert spaces at case/digit transitions using bounded patterns, then split.
  // Avoids a quantifier+lookahead regex (polynomial ReDoS).
  const spaced = str
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
  const words: string[] = [];
  for (const word of spaced.split(/[^A-Za-z0-9]+/)) {
    if (word) words.push(word);
  }
  return words;
}

function isAcronym(w: string): boolean {
  return w.length > 1 && w === w.toUpperCase();
}

function capitalizeFirst(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function joinWords(
  words: string[],
  to: CaseStyle,
  preserveAcronyms: boolean,
): string {
  const n = words.length;
  if (n === 0) return "";

  const sep =
    to === "kebab" ? "-" : to === "snake" ? "_" : to === "title" ? " " : "";
  const titlelike = to === "title" || to === "pascal" || to === "camel";

  let result = "";
  for (let i = 0; i < n; i++) {
    const raw = words[i];
    const keep = preserveAcronyms && isAcronym(raw);
    const firstCamel = to === "camel" && i === 0;
    const lowered = keep && !firstCamel ? raw : raw.toLowerCase();
    const word =
      titlelike && !firstCamel && !keep ? capitalizeFirst(lowered) : lowered;
    result += i > 0 ? sep + word : word;
  }
  return result;
}

/**
 * Converts a string between case styles.
 *
 * @param params - The parameters object
 * @param params.str - The string to convert
 * @param params.to - Target case style: "camel", "kebab", "snake", "pascal", or "title"
 * @param params.preserveAcronyms - If true, preserves all-uppercase words (e.g. "HTML") as acronyms instead of lowercasing them. Default false. In "camel", the first word is always lowercased regardless.
 * @returns The converted string
 *
 * @example
 * ```ts
 * transformCase({ str: "hello world", to: "camel" });
 * // => "helloWorld"
 *
 * transformCase({ str: "HTMLParser", to: "title", preserveAcronyms: true });
 * // => "HTML Parser"
 * ```
 *
 * @keywords camelCase, snake_case, kebab-case, PascalCase, title case, Title Case, convert case, acronym
 *
 * @throws Error if `str` is not a string
 * @throws Error if `to` is not a valid case style
 */
function transformCase({
  str,
  to,
  preserveAcronyms = false,
}: TransformCaseParams): TransformCaseResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (!VALID_STYLES.has(to)) {
    throw new Error(
      `The 'to' parameter must be one of: ${[...VALID_STYLES].join(", ")}`,
    );
  }

  if (str.length === 0) return "";

  return joinWords(splitWords(str), to, preserveAcronyms);
}

export { transformCase };
