---
"1o1-utils": minor
---

Add `isValidPhone` utility under the `validators` category. `isValidPhone({ phone })` checks a string as a well-formed E.164 international phone number — leading `+`, non-zero country code, 1–15 total digits. Common readability separators (spaces, hyphens, parentheses, dots) are stripped before validation; any other character causes rejection. Inputs longer than 32 characters are rejected immediately to avoid pathological regex work. Non-string inputs return `false`.

Pass an optional `country` (ISO 3166-1 alpha-2) to additionally enforce the dialing prefix and total digit length for that country. All ISO 3166-1 alpha-2 codes with an assigned ITU-T E.164 country code are supported (~240 territories). Country validation checks dial prefix and total digit count only — it does not distinguish mobile vs fixed-line nor verify area codes. Countries that share a dialing prefix (NANP +1, +7) cannot be distinguished.
