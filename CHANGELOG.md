# 1o1-utils

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
