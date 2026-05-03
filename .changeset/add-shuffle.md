---
"1o1-utils": minor
---

Add `shuffle` utility under the `arrays` category. `shuffle({ array })` returns a new array with the elements randomly reordered using the Fisher-Yates algorithm; the input is never mutated. Pass an optional `random: () => number` to inject a deterministic or seeded random source — useful for tests or reproducible output. Throws if `array` is not an array.
