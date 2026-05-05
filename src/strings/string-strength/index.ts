import type {
  Level,
  Pool,
  Score,
  StringStrengthParams,
  StringStrengthResult,
} from "./types.js";

const POOL_ORDER = [
  "lowercase",
  "uppercase",
  "digit",
  "symbol",
  "unicode",
] as const satisfies readonly Pool[];

/**
 * Evaluates the strength of a string via Shannon entropy and character pool
 * diversity. Useful for passwords, tokens, API keys, or any string where
 * complexity matters — generic alternative to password-rule validators.
 *
 * @param params - The parameters object
 * @param params.str - The string to evaluate
 * @returns An object with per-char `entropy`, `effectiveEntropy` (entropy ×
 * length), a `score` from 0 to 5, a `level` label, the detected character
 * `pools`, and `poolCount`.
 *
 * @example
 * ```ts
 * stringStrength({ str: "aaaaaa" });
 * // => { entropy: 0, effectiveEntropy: 0, score: 0, level: "very-weak",
 * //      pools: ["lowercase"], poolCount: 1 }
 *
 * stringStrength({ str: "abc123" });
 * // => { entropy: ~2.585, effectiveEntropy: ~15.51, score: 2, level: "fair",
 * //      pools: ["lowercase", "digit"], poolCount: 2 }
 *
 * stringStrength({ str: "Tr0ub4dor&3" });
 * // => { entropy: ~3.277, effectiveEntropy: ~36.05, score: 4, level: "strong",
 * //      pools: ["lowercase", "uppercase", "digit", "symbol"], poolCount: 4 }
 * ```
 *
 * @keywords entropy, password, strength, shannon, security, token, api-key, complexity, score, password strength
 *
 * @remarks
 * Per-char Shannon entropy: `H = -Σ p(x) * log2(p(x))` over Unicode code-point
 * frequencies (iterates the string's code-point iterator so emoji and CJK
 * count as one symbol).
 * Effective entropy `E = H × length` is used to derive the score:
 *
 * | score | level       | E threshold        |
 * | ----- | ----------- | ------------------ |
 * | 0     | very-weak   | E === 0            |
 * | 1     | weak        | 0 < E < 12         |
 * | 2     | fair        | 12 ≤ E < 24        |
 * | 3     | good        | 24 ≤ E < 36        |
 * | 4     | strong      | 36 ≤ E < 60        |
 * | 5     | very-strong | E ≥ 60             |
 *
 * Pools detected: `lowercase`, `uppercase`, `digit`, `symbol` (ASCII
 * non-alphanumeric), `unicode` (any non-ASCII code point).
 *
 * Shannon entropy measures character distribution only — it does not detect
 * patterns, dictionary words, or sequences. Inputs like `"abababab..."` can
 * score high despite being trivial to guess. Pair with a dictionary-aware
 * tool (e.g. zxcvbn) when those threats matter.
 *
 * @throws Error if `str` is not a string
 */
function stringStrength({ str }: StringStrengthParams): StringStrengthResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  const freq = new Map<string, number>();
  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;
  let hasSymbol = false;
  let hasUnicode = false;
  let length = 0;

  for (const ch of str) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
    length++;

    const code = ch.codePointAt(0) ?? 0;
    if (code > 127) {
      hasUnicode = true;
    } else if (code >= 97 && code <= 122) {
      hasLower = true;
    } else if (code >= 65 && code <= 90) {
      hasUpper = true;
    } else if (code >= 48 && code <= 57) {
      hasDigit = true;
    } else {
      hasSymbol = true;
    }
  }

  if (length === 0) {
    return {
      entropy: 0,
      effectiveEntropy: 0,
      score: 0,
      level: "very-weak",
      pools: [],
      poolCount: 0,
    };
  }

  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / length;
    entropy -= p * Math.log2(p);
  }

  const effectiveEntropy = entropy * length;

  const detected = {
    lowercase: hasLower,
    uppercase: hasUpper,
    digit: hasDigit,
    symbol: hasSymbol,
    unicode: hasUnicode,
  };
  const pools = POOL_ORDER.filter((p) => detected[p]);

  const { score, level } = scoreFromEntropy(effectiveEntropy);

  return {
    entropy,
    effectiveEntropy,
    score,
    level,
    pools,
    poolCount: pools.length,
  };
}

function scoreFromEntropy(effectiveEntropy: number): {
  score: Score;
  level: Level;
} {
  if (effectiveEntropy === 0) return { score: 0, level: "very-weak" };
  if (effectiveEntropy < 12) return { score: 1, level: "weak" };
  if (effectiveEntropy < 24) return { score: 2, level: "fair" };
  if (effectiveEntropy < 36) return { score: 3, level: "good" };
  if (effectiveEntropy < 60) return { score: 4, level: "strong" };
  return { score: 5, level: "very-strong" };
}

export { stringStrength };
