---
"1o1-utils": minor
---

Add `isNil` utility under `comparisons`. `isNil({ value })` returns `true` only when the value is `null` or `undefined`, making it the strict existence check that complements `isEmpty`. Useful for defaulting parameters without clobbering falsy-but-valid values like `0`, `""`, or `false`.
