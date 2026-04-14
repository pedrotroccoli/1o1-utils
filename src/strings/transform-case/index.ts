import type {
  CaseStyle,
  TransformCaseParams,
  TransformCaseResult,
} from "./types.js";

const VALID_STYLES = new Set<CaseStyle>(["camel", "kebab", "snake", "pascal"]);

const WORD_RE = /[A-Z]+(?=[A-Z][a-z])|[A-Z][a-z0-9]*|[a-z][a-z0-9]*|[0-9]+/g;

function splitWords(str: string): string[] {
  return str.match(WORD_RE) ?? [];
}

function joinWords(words: string[], to: CaseStyle): string {
  if (words.length === 0) return "";

  const lower = words.map((w) => w.toLowerCase());

  switch (to) {
    case "kebab":
      return lower.join("-");
    case "snake":
      return lower.join("_");
    case "camel":
      return (
        lower[0] +
        lower
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("")
      );
    case "pascal":
      return lower.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  }
}

/**
 * Converts a string between case styles.
 *
 * @param params - The parameters object
 * @param params.str - The string to convert
 * @param params.to - Target case style: "camel", "kebab", "snake", or "pascal"
 * @returns The converted string
 *
 * @example
 * ```ts
 * transformCase({ str: "hello world", to: "camel" });
 * // => "helloWorld"
 * ```
 *
 * @throws Error if `str` is not a string
 * @throws Error if `to` is not a valid case style
 */
function transformCase({ str, to }: TransformCaseParams): TransformCaseResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (!VALID_STYLES.has(to)) {
    throw new Error(
      `The 'to' parameter must be one of: ${[...VALID_STYLES].join(", ")}`,
    );
  }

  if (str.length === 0) return "";

  return joinWords(splitWords(str), to);
}

export { transformCase };
