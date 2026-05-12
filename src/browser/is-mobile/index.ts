import type { IsMobileParams, IsMobileResult } from "./types.js";

const MOBILE_RE =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|silk|symbian|series60|kaios/i;

function checkUserAgent(userAgent: string | undefined): boolean {
  if (typeof userAgent === "string") {
    return MOBILE_RE.test(userAgent);
  }

  if (typeof navigator === "undefined") return false;

  const uaData = (navigator as { userAgentData?: { mobile?: boolean } })
    .userAgentData;
  if (uaData !== undefined && typeof uaData.mobile === "boolean") {
    return uaData.mobile;
  }

  const ua = navigator.userAgent;
  return typeof ua === "string" && MOBILE_RE.test(ua);
}

function checkViewport(width: number | undefined, maxWidth: number): boolean {
  if (typeof width === "number") {
    return width <= maxWidth;
  }
  const w = (globalThis as { innerWidth?: unknown }).innerWidth;
  return typeof w === "number" && w <= maxWidth;
}

/**
 * Checks if the current device is a mobile device (phone or tablet).
 *
 * User-agent detection order:
 * 1. Explicit `userAgent` argument — useful for SSR (pass the request header)
 *    or unit tests.
 * 2. `navigator.userAgentData.mobile` from User-Agent Client Hints, when
 *    exposed by the browser.
 * 3. Regex against `navigator.userAgent`.
 *
 * Optional viewport check: pass `maxWidth` (e.g. `768`) to additionally treat
 * narrow viewports as mobile. The function returns `true` when **either** the
 * user agent matches a mobile device **or** the viewport width is `<= maxWidth`.
 *
 * SSR-safe: returns `false` when no `navigator` is available and no explicit
 * `userAgent` was passed, and silently skips the viewport check when no
 * `width`/`globalThis.innerWidth` is available.
 *
 * @param params - Optional parameters object
 * @param params.userAgent - Explicit user agent string. When provided, takes
 *   precedence over `globalThis.navigator`.
 * @param params.maxWidth - Enables viewport-based detection. When set, a
 *   viewport width `<= maxWidth` is also treated as mobile.
 * @param params.width - Explicit viewport width in pixels. When omitted, falls
 *   back to `globalThis.innerWidth`. Only used when `maxWidth` is set.
 * @returns `true` on mobile devices, `false` otherwise.
 *
 * @example
 * ```ts
 * isMobile();                                         // UA auto-detect
 * isMobile({ maxWidth: 768 });                        // UA OR viewport <= 768
 * isMobile({ userAgent: req.headers["user-agent"] }); // SSR with request UA
 * isMobile({ maxWidth: 768, width: 375 });            // SSR with explicit width
 * ```
 *
 * @keywords is mobile, mobile, device, user agent, browser, phone, tablet, ipad, iphone, android, responsive, viewport, breakpoint
 *
 * @see Navigator.userAgent — https://developer.mozilla.org/docs/Web/API/Navigator/userAgent
 * @see User-Agent Client Hints — https://developer.mozilla.org/docs/Web/API/User-Agent_Client_Hints_API
 * @see Window.innerWidth — https://developer.mozilla.org/docs/Web/API/Window/innerWidth
 *
 * @remarks
 * Tablets (iPad, Android tablets in tablet mode) match the UA check. Modern
 * iPadOS defaults to "request desktop site" and reports a macOS user agent —
 * those cases fail the UA check, but a small browser window with `maxWidth`
 * set will still be flagged as mobile via the viewport check. For pure
 * responsive layout decisions, prefer CSS media queries or
 * `window.matchMedia`; this utility is best for SSR hints, analytics, or
 * platform-specific copy.
 */
function isMobile(params: IsMobileParams = {}): IsMobileResult {
  const { userAgent, maxWidth, width } = params;

  if (checkUserAgent(userAgent)) return true;
  if (typeof maxWidth === "number" && checkViewport(width, maxWidth)) {
    return true;
  }
  return false;
}

export { isMobile };
