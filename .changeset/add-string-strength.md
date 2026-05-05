---
"1o1-utils": minor
---

Add `stringStrength` utility for strings: scores password/token/API-key strength via Shannon entropy and character pool diversity. Returns per-char `entropy`, `effectiveEntropy`, a 0–5 `score` with matching `level` (`very-weak`–`very-strong`), and the detected character `pools` (`lowercase`, `uppercase`, `digit`, `symbol`, `unicode`).
