# 1o1-utils

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
