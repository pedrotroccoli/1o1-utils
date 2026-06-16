---
"1o1-utils": minor
---

`slugify` accepts optional `separator` parameter (default `-`). Replaces non-alphanumeric runs with the separator and trims leading/trailing occurrences (the separator is regex-escaped via `escapeRegExp`, so any string is safe — including regex metacharacters like `.`). Pass `""` to concatenate runs without a separator. Throws if `separator` is not a string. Useful for snake-like slugs (`_`), filename-safe IDs, or custom delimiters without a `.replace(/-/g, …)` workaround.
