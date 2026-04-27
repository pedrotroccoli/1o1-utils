---
"1o1-utils": minor
---

Add `isValidUrl` utility and new `validators` category. `isValidUrl({ url, protocols? })` checks whether a value is a parseable URL string by delegating to the WHATWG `URL` API (using `URL.canParse` when available). Optional `protocols` accepts a string or array of allowed schemes (e.g., `["http", "https"]`) — names are matched case-insensitively without the trailing colon. Returns `false` for non-string, empty inputs, strings without a scheme, and URLs whose protocol is not in the allowlist when one is provided. Useful for validating user-supplied URLs before passing them to `fetch`, anchors, or storage.
