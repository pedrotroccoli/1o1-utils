import Bowser from "bowser";
import kaiIsMobile from "is-mobile";
import isMobileJsModule from "ismobilejs";
import MobileDetect from "mobile-detect";
import { Bench } from "tinybench";
import { UAParser } from "ua-parser-js";
import { isMobile } from "./index.js";

const isMobileJs = (
  typeof isMobileJsModule === "function"
    ? isMobileJsModule
    : (isMobileJsModule as { default: typeof isMobileJsModule }).default
) as (ua: string) => { any: boolean };

const MOBILE_RE =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|silk|symbian|series60|kaios/i;

const cases: Array<{ name: string; userAgent: string }> = [
  {
    name: "iphone",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "android",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
  {
    name: "desktop",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
];

const bench = new Bench({ name: "isMobile", time: 1000 });

for (const { name, userAgent } of cases) {
  bench
    .add(`1o1-utils (${name})`, () => {
      isMobile({ userAgent });
    })
    .add(`is-mobile (${name})`, () => {
      kaiIsMobile({ ua: userAgent });
    })
    .add(`ismobilejs (${name})`, () => {
      const _ = isMobileJs(userAgent).any;
      void _;
    })
    .add(`mobile-detect (${name})`, () => {
      const _ = new MobileDetect(userAgent).mobile() !== null;
      void _;
    })
    .add(`bowser (${name})`, () => {
      const type = Bowser.parse(userAgent).platform.type;
      const _ = type === "mobile" || type === "tablet";
      void _;
    })
    .add(`ua-parser-js (${name})`, () => {
      const type = new UAParser(userAgent).getDevice().type;
      const _ = type === "mobile" || type === "tablet";
      void _;
    })
    .add(`native regex (${name})`, () => {
      const _ = MOBILE_RE.test(userAgent);
      void _;
    });
}

export { bench };
