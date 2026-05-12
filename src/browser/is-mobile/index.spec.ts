import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import { isMobile } from "./index.js";

type GlobalLike = typeof globalThis & {
  navigator?: unknown;
  innerWidth?: unknown;
};

const g = globalThis as GlobalLike;

type GlobalKey = "navigator" | "innerWidth";

const originals: Record<GlobalKey, PropertyDescriptor | undefined> = {
  navigator: undefined,
  innerWidth: undefined,
};

const KEYS: readonly GlobalKey[] = ["navigator", "innerWidth"];

function snapshot() {
  for (const key of KEYS) {
    originals[key] = Object.getOwnPropertyDescriptor(g, key);
  }
}

function restore() {
  for (const key of KEYS) {
    const desc = originals[key];
    if (desc) {
      Object.defineProperty(g, key, desc);
    } else {
      delete (g as Record<string, unknown>)[key];
    }
  }
}

function setGlobal(key: GlobalKey, value: unknown) {
  Object.defineProperty(g, key, {
    value,
    configurable: true,
    writable: true,
  });
}

function clearGlobal(key: GlobalKey) {
  delete (g as Record<string, unknown>)[key];
}

function setNavigator(value: unknown) {
  setGlobal("navigator", value);
}

function clearNavigator() {
  clearGlobal("navigator");
}

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID_PHONE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID_TABLET_UA =
  "Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const DESKTOP_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const DESKTOP_FIREFOX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";
const IPADOS_DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const SYMBIAN_UA =
  "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/12.0.024; Profile/MIDP-2.1 Configuration/CLDC-1.1; en-us) AppleWebKit/525 (KHTML, like Gecko) WicKed/7.1.12344";
const KAIOS_UA =
  "Mozilla/5.0 (Mobile; LYF/F90M/LYF-F90M-000-02-15-280619; Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5";

describe("isMobile", () => {
  beforeEach(() => {
    snapshot();
  });

  afterEach(() => {
    restore();
  });

  describe("explicit userAgent param", () => {
    it("returns true for an iPhone user agent", () => {
      expect(isMobile({ userAgent: IPHONE_UA })).to.equal(true);
    });

    it("returns true for an Android phone user agent", () => {
      expect(isMobile({ userAgent: ANDROID_PHONE_UA })).to.equal(true);
    });

    it("returns true for an iPad user agent", () => {
      expect(isMobile({ userAgent: IPAD_UA })).to.equal(true);
    });

    it("returns true for an Android tablet user agent", () => {
      expect(isMobile({ userAgent: ANDROID_TABLET_UA })).to.equal(true);
    });

    it("returns false for a desktop Chrome user agent", () => {
      expect(isMobile({ userAgent: DESKTOP_CHROME_UA })).to.equal(false);
    });

    it("returns false for a desktop Firefox user agent", () => {
      expect(isMobile({ userAgent: DESKTOP_FIREFOX_UA })).to.equal(false);
    });

    it("returns false for the iPadOS 'request desktop site' user agent", () => {
      expect(isMobile({ userAgent: IPADOS_DESKTOP_UA })).to.equal(false);
    });

    it("returns true for a Symbian / Series60 user agent", () => {
      expect(isMobile({ userAgent: SYMBIAN_UA })).to.equal(true);
    });

    it("returns true for a KaiOS user agent", () => {
      expect(isMobile({ userAgent: KAIOS_UA })).to.equal(true);
    });

    it("returns false for an empty user agent string", () => {
      expect(isMobile({ userAgent: "" })).to.equal(false);
    });

    it("takes precedence over navigator", () => {
      setNavigator({ userAgent: IPHONE_UA });
      expect(isMobile({ userAgent: DESKTOP_CHROME_UA })).to.equal(false);
    });
  });

  describe("navigator-based detection", () => {
    it("returns false when navigator is undefined", () => {
      clearNavigator();
      expect(isMobile()).to.equal(false);
    });

    it("uses navigator.userAgentData.mobile === true when available", () => {
      setNavigator({
        userAgentData: { mobile: true },
        userAgent: DESKTOP_CHROME_UA,
      });
      expect(isMobile()).to.equal(true);
    });

    it("uses navigator.userAgentData.mobile === false when available", () => {
      setNavigator({
        userAgentData: { mobile: false },
        userAgent: IPHONE_UA,
      });
      expect(isMobile()).to.equal(false);
    });

    it("falls back to userAgent regex when userAgentData is missing", () => {
      setNavigator({ userAgent: IPHONE_UA });
      expect(isMobile()).to.equal(true);
    });

    it("falls back to userAgent regex when userAgentData.mobile is not a boolean", () => {
      setNavigator({
        userAgentData: {},
        userAgent: ANDROID_PHONE_UA,
      });
      expect(isMobile()).to.equal(true);
    });

    it("returns false when navigator.userAgent is missing", () => {
      setNavigator({});
      expect(isMobile()).to.equal(false);
    });

    it("returns false when navigator.userAgent is not a string", () => {
      setNavigator({ userAgent: 123 });
      expect(isMobile()).to.equal(false);
    });

    it("works when called with no arguments", () => {
      setNavigator({ userAgent: IPHONE_UA });
      expect(isMobile()).to.equal(true);
    });

    it("works when params is an empty object", () => {
      setNavigator({ userAgent: ANDROID_PHONE_UA });
      expect(isMobile({})).to.equal(true);
    });

    it("falls through to navigator when params.userAgent is undefined", () => {
      setNavigator({ userAgent: IPHONE_UA });
      expect(isMobile({ userAgent: undefined })).to.equal(true);
    });
  });

  describe("viewport-based detection", () => {
    it("returns true when explicit width is at or below maxWidth", () => {
      clearNavigator();
      expect(isMobile({ maxWidth: 768, width: 375 })).to.equal(true);
      expect(isMobile({ maxWidth: 768, width: 768 })).to.equal(true);
    });

    it("returns false when explicit width is above maxWidth", () => {
      clearNavigator();
      expect(isMobile({ maxWidth: 768, width: 1024 })).to.equal(false);
    });

    it("uses globalThis.innerWidth when width is not provided", () => {
      clearNavigator();
      setGlobal("innerWidth", 500);
      expect(isMobile({ maxWidth: 768 })).to.equal(true);

      setGlobal("innerWidth", 1280);
      expect(isMobile({ maxWidth: 768 })).to.equal(false);
    });

    it("ignores viewport when maxWidth is not set", () => {
      clearNavigator();
      setGlobal("innerWidth", 320);
      expect(isMobile()).to.equal(false);
    });

    it("returns true when UA matches even if viewport is wide", () => {
      setNavigator({ userAgent: IPHONE_UA });
      expect(isMobile({ maxWidth: 768, width: 1920 })).to.equal(true);
    });

    it("returns true when viewport matches even if UA is desktop", () => {
      setNavigator({ userAgent: DESKTOP_CHROME_UA });
      expect(isMobile({ maxWidth: 768, width: 400 })).to.equal(true);
    });

    it("skips viewport check when no width and no globalThis.innerWidth", () => {
      clearNavigator();
      clearGlobal("innerWidth");
      expect(isMobile({ maxWidth: 768 })).to.equal(false);
    });

    it("skips viewport check when globalThis.innerWidth is not a number", () => {
      clearNavigator();
      setGlobal("innerWidth", "not a number");
      expect(isMobile({ maxWidth: 768 })).to.equal(false);
    });
  });
});
