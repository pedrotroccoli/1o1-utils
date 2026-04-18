---
"1o1-utils": minor
---

Add `pipe` utility for left-to-right function composition. `pipe(...fns)` returns a function that applies each `fn` in sequence — the first receives the initial arguments, each next receives the previous return value. Aligned with the TC39 pipe operator proposal. Empty `pipe()` returns an identity function.
