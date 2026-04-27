---
"1o1-utils": minor
---

Add `deepEqual` utility under the `comparisons` category. `deepEqual({ a, b })` recursively compares two values for structural equality across nested plain objects, class instances (same prototype), arrays, `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, and typed arrays. Circular references are tracked via a `WeakMap` pair-cache. Pairs naturally with the previously shipped `shallowEqual`.
