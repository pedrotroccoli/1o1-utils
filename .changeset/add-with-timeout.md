---
"1o1-utils": minor
---

Add `withTimeout` utility to race a promise against a timeout. Rejects with a `TimeoutError` if the promise does not settle within the given duration. Supports a lazy error message factory and an optional `AbortSignal` for external cancellation. `TimeoutError` is exported from the `1o1-utils/with-timeout` subpath for `instanceof` checks.
