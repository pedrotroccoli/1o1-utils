---
"1o1-utils": minor
---

Add `escapeRegExp` utility under the `strings` category. `escapeRegExp({ str })` escapes the 12 ECMAScript regex metacharacters (`. * + ? ^ $ { } ( ) | [ ] \`) so a string can be safely interpolated into a `RegExp`, preventing regex injection when user input drives a pattern. Throws if `str` is not a string. Returns `""` for empty input and leaves strings without specials unchanged.
