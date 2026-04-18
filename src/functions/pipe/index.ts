import type { PipeFn } from "./types.js";

/**
 * Composes functions left-to-right into a single function. The first function
 * receives the initial arguments; each subsequent function receives the
 * previous function's return value.
 *
 * @param fns - Functions to compose, executed in the order provided
 * @returns A function that applies every `fn` in sequence
 *
 * @example
 * ```ts
 * const slug = pipe(
 *   (x: string) => x.trim(),
 *   (x: string) => x.toLowerCase(),
 *   (x: string) => x.replace(/\s+/g, "-"),
 * );
 *
 * slug("  Hello World  "); // "hello-world"
 * ```
 *
 * @keywords compose, function composition, flow, left-to-right, pipeline, chain, sequence, combine functions
 * @see TC39 pipe operator proposal (https://github.com/tc39/proposal-pipeline-operator)
 *
 * @throws Error if any argument is not a function
 *
 * @remarks
 * With zero arguments, returns an identity function that passes its first
 * argument through unchanged. Execution is synchronous — if a function returns
 * a Promise, the next function receives the Promise (not the awaited value).
 * Only the first function receives the caller's `this` context; subsequent
 * stages are called without `this` (differs from `lodash/flow` and
 * `es-toolkit/flow`, which forward `this` to every stage).
 */
const pipe: PipeFn = ((...fns: Array<(...args: unknown[]) => unknown>) => {
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== "function") {
      throw new Error("All 'fns' parameters must be functions");
    }
  }

  if (fns.length === 0) {
    return (x: unknown) => x;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function (this: unknown, ...args: unknown[]) {
    let result = fns[0].apply(this, args);
    for (let i = 1; i < fns.length; i++) {
      const fn = fns[i];
      result = fn(result);
    }
    return result;
  };
}) as PipeFn;

export { pipe };
