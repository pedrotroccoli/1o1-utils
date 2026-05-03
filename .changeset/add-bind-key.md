---
"1o1-utils": minor
---

Add `bindKey` utility under a new `browser` category. `bindKey(combo, handler, options?)` binds keyboard shortcuts to a callback and returns an idempotent unbind function. Combo grammar uses `+` for simultaneous modifiers (e.g. `ctrl+shift+p`) and spaces for key sequences (e.g. `g i`). Supports `ctrl`, `shift`, `alt`, `meta` (alias `cmd`), and a cross-platform `mod` modifier (= `meta` on Mac, `ctrl` elsewhere). Options include `target` (defaults to `window`, accepts any `EventTarget` for testing or scoping), `filterInputs` (default `true`, skips when focus is on `INPUT`/`TEXTAREA`/`SELECT`/`contenteditable`; modifier combos bypass the filter), `sequenceTimeout` (default `1000` ms), and `preventDefault` (default `false`). Browser-only — throws a clear error when no `target` is provided outside a browser environment. Closes #77.
