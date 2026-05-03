---
"1o1-utils": minor
---

Add `waitForCondition` utility under the `async` category. `waitForCondition({ condition, interval, timeout, message?, signal? })` polls a sync or async predicate at the given `interval` (default 100ms) until it returns truthy, rejecting with `TimeoutError` after `timeout` ms (default 5000). Errors thrown or rejected by `condition` propagate immediately without further polling. Optional `AbortSignal` cancels externally; `message` is a string or lazy factory only invoked on timeout. Reuses `TimeoutError` from `withTimeout` so consumers can catch both with a single `instanceof` check. Closes #76.
