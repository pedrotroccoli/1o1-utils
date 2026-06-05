---
"1o1-utils": patch
---

Add top-level `main` and `module` fields pointing to `./dist/index.js`. Bundlers without full `exports`-field support (e.g. Sandpack/CodeSandbox, used by the docs Playground) fell back to a missing `main` and threw `ModuleNotFoundError: null`. The `exports` map is unchanged; these fields only re-expose the existing ESM entry via the legacy keys.
