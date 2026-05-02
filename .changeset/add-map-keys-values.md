---
"1o1-utils": minor
---

Add `mapKeys` and `mapValues` utilities under the `objects` category. `mapKeys({ obj, iteratee })` returns a new object with each key replaced by `String(iteratee(value, key, obj))`; collisions resolve last-write-wins and prototype-pollution keys (`__proto__`, `constructor`, `prototype`) are skipped. `mapValues({ obj, iteratee })` returns a new object with the same keys but each value replaced by `iteratee(value, key, obj)`. Both walk own enumerable string keys only, do not mutate the input, and throw if `obj` is not a plain object or `iteratee` is not a function.
