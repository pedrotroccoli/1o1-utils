---
"1o1-utils": minor
---

Add `compact` utility for objects: removes falsy values (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`) with an optional `keep` list to preserve specific falsy values via `Object.is`.
