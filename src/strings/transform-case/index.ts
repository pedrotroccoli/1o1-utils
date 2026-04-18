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
  // Single-pass char scan. Emits a word at each case/digit boundary.
  // No regex — linear, no backtracking (avoids polynomial ReDoS).
  const words: string[] = [];
  const len = str.length;
  let start = -1;
  let prev = 0; // 0=separator, 1=digit, 2=lower, 3=upper

  for (let i = 0; i < len; i++) {
    const c = str.charCodeAt(i);
    const kind =
      c >= 97 && c <= 122
        ? 2
        : c >= 65 && c <= 90
          ? 3
          : c >= 48 && c <= 57
            ? 1
            : 0;

    if (kind === 0) {
      if (start !== -1) {
        words.push(str.substring(start, i));
        start = -1;
      }
      prev = 0;
      continue;
    }

    let boundary = false;
    if (prev === 0) {
      boundary = true;
    } else if (prev !== kind) {
      if (prev === 2 && kind === 3) boundary = true;
      else if (prev === 1 || kind === 1) boundary = true;
    } else if (prev === 3 && i + 1 < len) {
      const nc = str.charCodeAt(i + 1);
      if (nc >= 97 && nc <= 122) boundary = true;
    }

    if (boundary && start !== -1) {
      words.push(str.substring(start, i));
    }
    if (boundary) start = i;
    prev = kind;
  }

  if (start !== -1) words.push(str.substring(start));

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
