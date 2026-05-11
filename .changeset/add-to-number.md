---
"1o1-utils": minor
---

Add `toNumber` utility for numbers: extracts a numeric value from a string, respecting the locale's decimal and group separators (via `Intl.NumberFormat`). Defaults to `"en-US"`. Strips currency symbols, whitespace, and arbitrary non-digit characters; supports negative values via a leading `-` (or Unicode `−`). Throws when the input contains no digits or cannot be parsed.
