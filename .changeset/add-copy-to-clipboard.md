---
"1o1-utils": minor
---

Add `copyToClipboard` utility under the new `browser` category. `copyToClipboard({ text })` writes a string to the system clipboard using the asynchronous Clipboard API when running in a secure context (HTTPS or `localhost`) and falls back to a hidden, off-screen `<textarea>` plus `document.execCommand("copy")` for older browsers and insecure pages. The fallback removes the temporary node in a `finally` block so DOM state stays clean even when the copy fails. Browser-only — throws `"Clipboard not available in this environment"` in Node/SSR. Closes #64.
