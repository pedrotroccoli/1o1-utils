---
"1o1-utils": minor
---

Add `flatten` and `unflatten` utilities under `objects/`. `flatten` deep-flattens arrays (mirroring `Array.prototype.flat` with a configurable `depth`) or converts a nested plain object into a flat record with dot-notation keys. `unflatten` is the inverse for objects, with an optional `arrays` flag that reconstructs arrays from all-numeric segments. Both protect against prototype pollution by skipping `__proto__`, `constructor`, and `prototype` segments. Closes #73 and #82.
