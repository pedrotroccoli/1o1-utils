---
"1o1-utils": minor
---

Add `isValidPhone` utility under the `validators` category. `isValidPhone({ phone })` checks a string as a well-formed E.164 international phone number — leading `+`, non-zero country code, 1–15 total digits. Common readability separators (spaces, hyphens, parentheses, dots) are stripped before validation; any other character causes rejection. Inputs longer than 32 characters are rejected immediately to avoid pathological regex work. Non-string inputs return `false`.
