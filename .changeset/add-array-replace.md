---
"1o1-utils": minor
---

Add `replace` utility for replacing element(s) in an array by predicate. Returns a new array (non-mutating). Replaces only the first match by default; pass `all: true` to replace every match. Accepts a static value or an updater function `(item, index) => newItem`.
