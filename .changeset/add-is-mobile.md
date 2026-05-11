---
"1o1-utils": minor
---

Add `isMobile` utility for browser: detect a mobile device (phone or tablet). User-agent resolution via explicit `userAgent` argument, `navigator.userAgentData.mobile` (User-Agent Client Hints), then a regex against `navigator.userAgent`. Optional viewport-width check via `maxWidth` (combined with the UA check via logical OR), using either an explicit `width` argument or `globalThis.innerWidth`. SSR-safe — returns `false` when no `navigator`/`innerWidth` is available and no explicit override was passed.
