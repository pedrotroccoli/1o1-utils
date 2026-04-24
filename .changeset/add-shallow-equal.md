---
"1o1-utils": minor
---

Add `shallowEqual` utility and new `comparisons` category. `shallowEqual({ a, b })` compares two values by their top-level entries using `Object.is`, returning `true` for identical primitives, same references, or arrays/plain objects with matching first-level entries. Ideal for memoization, preventing unnecessary re-renders, and state comparison.
