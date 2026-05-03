---
"1o1-utils": minor
---

Add `memo` utility under the `functions` category. `memo({ fn, ttl?, key? })` returns a memoized wrapper that caches `fn`'s result per unique argument set so repeat calls skip the computation. Optional `ttl` (milliseconds) expires entries lazily, measured against `performance.now()` for monotonic immunity to system clock changes. Optional `key` resolver maps arguments to a custom cache identity. The default key resolver is hybrid: a single primitive arg is used directly (allocation-free `Map` lookup) and any other shape falls back to `JSON.stringify(args)`, avoiding the lodash footgun of collapsing object args to one key. The wrapper exposes `.clear()`, `.delete(key)`, and a read-only `.size`. Errors propagate without being cached, so the next call retries. Closes #84.
