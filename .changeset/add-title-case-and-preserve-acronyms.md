---
"1o1-utils": minor
---

Extend `transformCase` with a `"title"` target style (`transformCase({ str, to: "title" })` → `"Hello World"`) and a new `preserveAcronyms` option that keeps all-uppercase words like `"HTML"` intact instead of lowercasing them (e.g. `transformCase({ str: "HTMLParser", to: "title", preserveAcronyms: true })` → `"HTML Parser"`). In `camel`, the leading word is always lowercased for convention.
