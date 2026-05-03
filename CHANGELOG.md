# 1o1-utils

## 1.9.0

### Minor Changes

- 84cb58f: Add `partition` utility for splitting an array into two groups by predicate, with type-guard narrowing support.
- 1f5a244: Add `replace` utility for replacing element(s) in an array by predicate. Returns a new array (non-mutating). Replaces only the first match by default; pass `all: true` to replace every match. Accepts a static value or an updater function `(item, index) => newItem`.
- 1c8bdd0: Add `bindKey` utility under a new `browser` category. `bindKey(combo, handler, options?)` binds keyboard shortcuts to a callback and returns an idempotent unbind function. Combo grammar uses `+` for simultaneous modifiers (e.g. `ctrl+shift+p`) and spaces for key sequences (e.g. `g i`). Supports `ctrl`, `shift`, `alt`, `meta` (alias `cmd`), and a cross-platform `mod` modifier (= `meta` on Mac, `ctrl` elsewhere). Options include `target` (defaults to `window`, accepts any `EventTarget` for testing or scoping), `filterInputs` (default `true`, skips when focus is on `INPUT`/`TEXTAREA`/`SELECT`/`contenteditable`; modifier combos bypass the filter), `sequenceTimeout` (default `1000` ms), and `preventDefault` (default `false`). Browser-only — throws a clear error when no `target` is provided outside a browser environment. Closes #77.
- abeb202: Add `compact` utility for objects: removes falsy values (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`) with an optional `keep` list to preserve specific falsy values via `Object.is`.
- 512a94b: Add `copyToClipboard` utility under the new `browser` category. `copyToClipboard({ text })` writes a string to the system clipboard using the asynchronous Clipboard API when running in a secure context (HTTPS or `localhost`) and falls back to a hidden, off-screen `<textarea>` plus `document.execCommand("copy")` for older browsers and insecure pages. The fallback removes the temporary node in a `finally` block so DOM state stays clean even when the copy fails. Browser-only — throws `"Clipboard not available in this environment"` in Node/SSR. Closes #64.
- 645bda4: Add `isValidEmail` utility under the `validators` category. `isValidEmail({ email })` checks a string against the HTML5 living-standard email pattern (the same one browsers use for `<input type="email">`) with RFC 5321 length limits (local part ≤64, total ≤254). Pragmatic over RFC 5322 strict — accepts the addresses people actually use. Pass `allowDisplayName: true` to also accept display-name form like `"Jane Doe <jane@example.com>"`. Non-string inputs return `false`.
- 751fdc5: Add `isValidPhone` utility under the `validators` category. `isValidPhone({ phone })` checks a string as a well-formed E.164 international phone number — leading `+`, non-zero country code, 1–15 total digits. Common readability separators (spaces, hyphens, parentheses, dots) are stripped before validation; any other character causes rejection. Inputs longer than 32 characters are rejected immediately to avoid pathological regex work. Non-string inputs return `false`.

  Pass an optional `country` (ISO 3166-1 alpha-2) to additionally enforce the dialing prefix and total digit length for that country. All ISO 3166-1 alpha-2 codes with an assigned ITU-T E.164 country code are supported (~240 territories). Country validation checks dial prefix and total digit count only — it does not distinguish mobile vs fixed-line nor verify area codes. Countries that share a dialing prefix (NANP +1, +7) cannot be distinguished.

- 6ad40b3: Add `memo` utility under the `functions` category. `memo({ fn, ttl?, key? })` returns a memoized wrapper that caches `fn`'s result per unique argument set so repeat calls skip the computation. Optional `ttl` (milliseconds) expires entries lazily, measured against `performance.now()` for monotonic immunity to system clock changes. Optional `key` resolver maps arguments to a custom cache identity. The default key resolver is hybrid: a single primitive arg is used directly (allocation-free `Map` lookup) and any other shape falls back to `JSON.stringify(args)`, avoiding the lodash footgun of collapsing object args to one key. The wrapper exposes `.clear()`, `.delete(key)`, and a read-only `.size`. Errors propagate without being cached, so the next call retries. Closes #84.
- 35aae67: Add `normalizeEmail` utility under the `strings` category. `normalizeEmail({ email })` trims whitespace and lowercases the address. Pass `stripPlus: true` to also drop plus-addressing (`user+tag@example.com` → `user@example.com`), useful for deduplicating emails since most providers route plus-tagged addresses to the same mailbox. Throws on non-string or empty input. Pair with `isValidEmail` for format validation.
- eef7691: Add `pickBy` and `omitBy` utilities for predicate-based object filtering. Counterparts to `pick`/`omit` that select or exclude entries based on `(value, key) => boolean`.
- 9fcbabc: Add `shuffle` utility under the `arrays` category. `shuffle({ array })` returns a new array with the elements randomly reordered using the Fisher-Yates algorithm; the input is never mutated. Pass an optional `random: () => number` to inject a deterministic or seeded random source — useful for tests or reproducible output. Throws if `array` is not an array.
- d6ea1d4: Add `secondsToTimeFormat` and `timeFormatToSeconds` utilities under a new `formatters/` category. Bidirectional conversion between seconds and zero-padded time strings (`MM:SS` or `[H]H:MM:SS`). `secondsToTimeFormat` accepts an optional `padHours` flag; `timeFormatToSeconds` is the strict inverse. Fills the gap left by `date-fns#formatDuration`, which only outputs locale text.
- d453fdf: Add `waitForCondition` utility under the `async` category. `waitForCondition({ condition, interval, timeout, message?, signal? })` polls a sync or async predicate at the given `interval` (default 100ms) until it returns truthy, rejecting with `TimeoutError` after `timeout` ms (default 5000). Errors thrown or rejected by `condition` propagate immediately without further polling. Optional `AbortSignal` cancels externally; `message` is a string or lazy factory only invoked on timeout. Reuses `TimeoutError` from `withTimeout` so consumers can catch both with a single `instanceof` check. Closes #76.

## 1.8.0

### Minor Changes

- 3882bb4: Add `diff` utility for array set-difference with optional iteratee for object identity.
- 9a6c9bf: Add `range` utility for generating numeric sequences with optional start and step.
- 79f82a7: Add `clamp` utility under the `numbers` category. `clamp({ value, min, max })` restricts a number to the inclusive range `[min, max]`: returns `min` if `value` is below the range, `max` if above, otherwise `value`. Bounds are swapped silently when `min > max`. Throws if any parameter is not a number or is `NaN`. Works with `Infinity` bounds and floating-point values.
- 780ea0d: Add `escapeRegExp` utility under the `strings` category. `escapeRegExp({ str })` escapes the 12 ECMAScript regex metacharacters (`. * + ? ^ $ { } ( ) | [ ] \`) so a string can be safely interpolated into a `RegExp`, preventing regex injection when user input drives a pattern. Throws if `str` is not a string. Returns `""` for empty input and leaves strings without specials unchanged.
- cc7d454: Add `mapKeys` and `mapValues` utilities under the `objects` category. `mapKeys({ obj, iteratee })` returns a new object with each key replaced by `String(iteratee(value, key, obj))`; collisions resolve last-write-wins and prototype-pollution keys (`__proto__`, `constructor`, `prototype`) are skipped. `mapValues({ obj, iteratee })` returns a new object with the same keys but each value replaced by `iteratee(value, key, obj)`. Both walk own enumerable string keys only, do not mutate the input, and throw if `obj` is not a plain object or `iteratee` is not a function.
- 263c026: Add `randomInt` utility under the `numbers` category. `randomInt({ min, max })` returns a cryptographically-secure random integer in the inclusive range `[min, max]` using `crypto.getRandomValues` with rejection sampling — no modulo bias and no `Math.random`. Supports the full safe-integer range. Bounds are swapped silently when `min > max`. Throws on non-integer input, `NaN`, or a range that exceeds `2^53`.
- 9a7037e: Add `times` utility under the `arrays` category. `times({ count, fn })` invokes `fn` `count` times with the current index and returns an array of the results. Strictly validates inputs: throws if `count` is not a non-negative integer or `fn` is not a function. `count: 0` returns `[]`.
- b60ff54: Add `zip` and `unzip` utilities under the `arrays` category. `zip({ arrays })` combines arrays by index into tuples; `unzip({ array })` splits an array of tuples back into separate arrays. Both accept an optional `strategy: "fill" | "truncate"` to control behavior on uneven lengths — `"fill"` (default) pads shorter arrays with `undefined`, `"truncate"` cuts to the shortest.

## 1.7.1

### Patch Changes

- Republish of 1.7.0 with the full set of advertised subpath exports. The published 1.7.0 tarball was built from a stale tree and shipped without `deep-equal`, `is-nil`, `is-valid-url`, and `safely`. 1.7.0 has been deprecated on npm; upgrade to 1.7.1 to access all utilities listed in the 1.7.0 changelog.

## 1.7.0

### Minor Changes

- bcf23fb: Add `deepEqual` utility under the `comparisons` category. `deepEqual({ a, b })` recursively compares two values for structural equality across nested plain objects, class instances (same prototype), arrays, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and typed arrays. Circular references are tracked via a `WeakMap` pair-cache. Pairs naturally with the previously shipped `shallowEqual`.
- 776b767: Add `isNil` utility under `comparisons`. `isNil({ value })` returns `true` only when the value is `null` or `undefined`, making it the strict existence check that complements `isEmpty`. Useful for defaulting parameters without clobbering falsy-but-valid values like `0`, `""`, or `false`.
- 3a44724: Add `isValidUrl` utility and new `validators` category. `isValidUrl({ url, protocols? })` checks whether a value is a parseable URL string by delegating to the WHATWG `URL` API (using `URL.canParse` when available). Optional `protocols` accepts a string or array of allowed schemes (e.g., `["http", "https"]`) — names are matched case-insensitively without the trailing colon. Returns `false` for non-string, empty inputs, strings without a scheme, and URLs whose protocol is not in the allowlist when one is provided. Useful for validating user-supplied URLs before passing them to `fetch`, anchors, or storage.
- efe8f69: Add `pipe` utility for left-to-right function composition. `pipe(...fns)` returns a function that applies each `fn` in sequence — the first receives the initial arguments, each next receives the previous return value. Aligned with the TC39 pipe operator proposal. Empty `pipe()` returns an identity function.
- edd6bd1: Add `safely` utility to wrap a function so it returns a `[error, result]` tuple instead of throwing. Auto-detects sync and async functions: sync calls return a tuple, async calls return a `Promise` of a tuple. Eliminates verbose try/catch and anticipates the TC39 Safe Assignment Operator proposal. Closes #87.
- b851690: Add `shallowEqual` utility and new `comparisons` category. `shallowEqual({ a, b })` compares two values by their top-level entries using `Object.is`, returning `true` for identical primitives, same references, or arrays/plain objects with matching first-level entries. Ideal for memoization, preventing unnecessary re-renders, and state comparison.
- 4f847c5: Add `withTimeout` utility to race a promise against a timeout. Rejects with a `TimeoutError` if the promise does not settle within the given duration. Supports a lazy error message factory and an optional `AbortSignal` for external cancellation. `TimeoutError` is exported from the `1o1-utils/with-timeout` subpath for `instanceof` checks.

## 1.6.0

### Minor Changes

- d4414cf: Add `once` utility and new `functions` category. `once(fn)` returns a wrapper that executes `fn` on the first call, caches the result, and ignores subsequent arguments — ideal for lazy initialization and singleton patterns.
- f5463d6: Extend `transformCase` with a `"title"` target style (`transformCase({ str, to: "title" })` → `"Hello World"`) and a new `preserveAcronyms` option that keeps all-uppercase words like `"HTML"` intact instead of lowercasing them (e.g. `transformCase({ str: "HTMLParser", to: "title", preserveAcronyms: true })` → `"HTML Parser"`). In `camel`, the leading word is always lowercased for convention.

## 1.5.0

### Minor Changes

- 991751e: Add `defaults` and `defaultsDeep` utilities for filling `undefined` properties with fallback values. `defaults` handles shallow objects; `defaultsDeep` recurses into nested plain objects while preserving arrays and other non-plain values in the target.
- 7357453: Add `get` and `set` utilities for dot-notation access to nested object properties.

  - `get({ obj, path, defaultValue })` — safely reads a nested value; returns `defaultValue` (or `undefined`) when the path does not resolve. Never throws.
  - `set({ obj, path, value, objectify })` — immutably writes a nested value using structural sharing; clones only nodes on the path. Numeric segments create arrays by default; pass `objectify: true` to create plain objects instead.

## 1.4.1

### Patch Changes

- c371bfe: Add `@keywords` JSDoc tags to all 17 utilities for search discoverability, and add "Also known as" and "Prompt suggestion" sections to all utility doc pages

## 1.4.0

### Minor Changes

- f0ccd3d: Add capitalize, transformCase, debounce, and throttle utilities

  - `capitalize`: capitalize the first letter of a string with optional `preserveRest`
  - `transformCase`: convert strings between camelCase, kebab-case, snake_case, and PascalCase
  - `debounce`: delay function execution until after a quiet period, with cancel support
  - `throttle`: limit function execution to once per time window (leading + trailing), with cancel support

- f2e8fec: Add deepMerge object utility

  - `deepMerge`: recursively merge two objects with source taking precedence

- 0b8986b: Add isEmpty, sleep, and retry utilities

  - `isEmpty`: check if a value is empty (null, undefined, empty string, array, object, Map, Set)
  - `sleep`: async delay function with input validation
  - `retry`: retry async functions with configurable attempts, delay, and backoff (fixed or exponential)

- f53e55e: Add truncate and slugify string utilities

  - `truncate`: truncate a string to a given length with configurable suffix (default `...`)
  - `slugify`: convert a string to a URL-friendly slug with accent support

## 1.3.0

### Minor Changes

- f443a46: Add `groupBy` utility to group array items by a given key
- d1c1f3c: Add `omit` utility for objects with nested key support via dot notation
- f877e0b: Add `pick` utility for objects with nested key support via dot notation
- cabbd39: Add `sortBy` utility for arrays with dot notation key support and numeric fast path

## 1.2.0

### Minor Changes

- 78c293a: Added `unique` utility that deduplicates an array, optionally by a specific key. Useful for removing duplicate entries from API responses, normalizing datasets, and ensuring collection uniqueness.

  ```typescript
  import { unique } from "1o1-utils";

  unique({ array: [1, 2, 2, 3] });
  // → [1, 2, 3]

  unique({ array: [{ id: 1 }, { id: 1 }, { id: 2 }], key: "id" });
  // → [{ id: 1 }, { id: 2 }]
  ```

- 7019195: Added `chunk` utility that splits an array into groups of a given size. Useful for batching API calls, pagination, and processing large datasets in groups.

  ```typescript
  import { chunk } from "1o1-utils";

  chunk({ array: [1, 2, 3, 4, 5], size: 2 });
  // → [[1, 2], [3, 4], [5]]
  ```
