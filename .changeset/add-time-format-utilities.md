---
"1o1-utils": minor
---

Add `secondsToTimeFormat` and `timeFormatToSeconds` utilities under a new `formatters/` category. Bidirectional conversion between seconds and zero-padded time strings (`MM:SS` or `[H]H:MM:SS`). `secondsToTimeFormat` accepts an optional `padHours` flag; `timeFormatToSeconds` is the strict inverse. Fills the gap left by `date-fns#formatDuration`, which only outputs locale text.
