---
"1o1-utils": minor
---

Add `zip` and `unzip` utilities under the `arrays` category. `zip({ arrays })` combines arrays by index into tuples; `unzip({ array })` splits an array of tuples back into separate arrays. Both accept an optional `strategy: "fill" | "truncate"` to control behavior on uneven lengths — `"fill"` (default) pads shorter arrays with `undefined`, `"truncate"` cuts to the shortest.
