import type { ShuffleParams, ShuffleResult } from "./types.js";

/**
 * Randomly shuffles an array using the Fisher-Yates algorithm.
 *
 * The default `random` source is `Math.random`, which is **not** cryptographically
 * secure. For adversarial contexts (raffles, security-sensitive sampling), inject a
 * CSPRNG-based source built on `crypto.getRandomValues`.
 *
 * @param params - The parameters object
 * @param params.array - The array to shuffle
 * @param params.random - Optional random source returning a number in `[0, 1)`. Defaults to `Math.random`. Out-of-range outputs are clamped to keep swap indices in bounds.
 * @returns A new array with the elements in random order
 *
 * @example
 * ```ts
 * shuffle({ array: [1, 2, 3, 4, 5] });
 * // => [3, 1, 5, 2, 4] (random order)
 * ```
 *
 * @keywords randomize, scramble, fisher-yates, knuth-shuffle
 *
 * @throws Error if `array` is not an array
 */
function shuffle<T>({ array, random }: ShuffleParams<T>): ShuffleResult<T> {
  if (!Array.isArray(array)) {
    throw new Error("The 'array' parameter is not an array");
  }

  const rand = random ?? Math.random;
  const result = array.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.min(Math.floor(rand() * (i + 1)), i);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

export { shuffle };
