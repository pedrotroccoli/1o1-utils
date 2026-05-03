---
"1o1-utils": minor
---

Add `randomInt` utility under the `numbers` category. `randomInt({ min, max })` returns a cryptographically-secure random integer in the inclusive range `[min, max]` using `crypto.getRandomValues` with rejection sampling — no modulo bias and no `Math.random`. Supports the full safe-integer range. Bounds are swapped silently when `min > max`. Throws on non-integer input, `NaN`, or a range that exceeds `2^53`.
