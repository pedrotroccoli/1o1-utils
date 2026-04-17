---
"1o1-utils": minor
---

Add `get` and `set` utilities for dot-notation access to nested object properties.

- `get({ obj, path, defaultValue })` — safely reads a nested value; returns `defaultValue` (or `undefined`) when the path does not resolve. Never throws.
- `set({ obj, path, value, objectify })` — immutably writes a nested value using structural sharing; clones only nodes on the path. Numeric segments create arrays by default; pass `objectify: true` to create plain objects instead.
