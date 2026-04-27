---
"1o1-utils": minor
---

Add `isValidUrl` utility and new `validators` category. `isValidUrl({ url })` checks whether a value is a parseable URL string by delegating to the WHATWG `URL` API (using `URL.canParse` when available). Returns `false` for non-string, empty, and whitespace-only inputs, and for strings without a scheme. Useful for validating user-supplied URLs before passing them to `fetch`, anchors, or storage.
