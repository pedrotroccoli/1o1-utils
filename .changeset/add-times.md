---
"1o1-utils": minor
---

Add `times` utility under the `arrays` category. `times({ count, fn })` invokes `fn` `count` times with the current index and returns an array of the results. Strictly validates inputs: throws if `count` is not a non-negative integer or `fn` is not a function. `count: 0` returns `[]`.
