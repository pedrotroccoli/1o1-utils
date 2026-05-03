---
"1o1-utils": minor
---

Add `normalizeEmail` utility under the `strings` category. `normalizeEmail({ email })` trims whitespace and lowercases the address. Pass `stripPlus: true` to also drop plus-addressing (`user+tag@example.com` → `user@example.com`), useful for deduplicating emails since most providers route plus-tagged addresses to the same mailbox. Throws on non-string or empty input. Pair with `isValidEmail` for format validation.
