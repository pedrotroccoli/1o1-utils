---
"1o1-utils": minor
---

Add `isValidEmail` utility under the `validators` category. `isValidEmail({ email })` checks a string against the HTML5 living-standard email pattern (the same one browsers use for `<input type="email">`) with RFC 5321 length limits (local part ≤64, total ≤254). Pragmatic over RFC 5322 strict — accepts the addresses people actually use. Pass `allowDisplayName: true` to also accept display-name form like `"Jane Doe <jane@example.com>"`. Non-string inputs return `false`.
