---
"1o1-utils": minor
---

Add `safely` utility to wrap a function so it returns a `[error, result]` tuple instead of throwing. Auto-detects sync and async functions: sync calls return a tuple, async calls return a `Promise` of a tuple. Eliminates verbose try/catch and anticipates the TC39 Safe Assignment Operator proposal. Closes #87.
