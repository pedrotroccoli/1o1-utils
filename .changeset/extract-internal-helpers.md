---
"1o1-utils": patch
---

Extract shared internal helpers (`isPlainObject`, `UNSAFE_KEYS`, `isNumericSegment`/`isNumericSlice`, `safeAssign`) into a new internal module `src/_internal/`. Eliminates duplication across 12 object utilities (`flatten`, `unflatten`, `map-values`, `map-keys`, `defaults`, `defaults-deep`, `deep-merge`, `pick`, `pick-by`, `omit-by`, `compact`, `set`). Internal-only refactor — no public API change. The unified `isPlainObject` is a strict superset of the previous variants (now accepts both `Object.create(null)` and objects whose ancestor proto chain ends at `Object.prototype`), closing a prior inconsistency.
