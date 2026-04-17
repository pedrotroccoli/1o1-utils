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

const WORD_RE = /[A-Z]+(?=[A-Z][a-z])|[A-Z][a-z0-9]*|[a-z][a-z0-9]*|[0-9]+/g;

function splitWords(str: string): string[] {
  return str.match(WORD_RE) ?? [];
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
  if (words.length === 0) return "";

  const normalize = (w: string) =>
    preserveAcronyms && isAcronym(w) ? w : w.toLowerCase();

  const normalized = words.map(normalize);

  switch (to) {
    case "kebab":
      return normalized.join("-");
    case "snake":
      return normalized.join("_");
    case "title":
      return normalized
        .map((w) => (isAcronym(w) ? w : capitalizeFirst(w)))
        .join(" ");
    case "camel":
      return (
        normalized[0].toLowerCase() +
        normalized
          .slice(1)
          .map((w) => (isAcronym(w) ? w : capitalizeFirst(w)))
          .join("")
      );
    case "pascal":
      return normalized
        .map((w) => (isAcronym(w) ? w : capitalizeFirst(w)))
        .join("");
  }
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
