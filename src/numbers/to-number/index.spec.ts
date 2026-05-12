import { expect } from "chai";
import { describe, it } from "mocha";
import { __SEPARATOR_CACHE_MAX, __separatorCache, toNumber } from "./index.js";

describe("toNumber", () => {
  it("should parse a plain integer using the default locale", () => {
    expect(toNumber({ value: "123" })).to.equal(123);
  });

  it("should parse a decimal using the default en-US locale", () => {
    expect(toNumber({ value: "12.5" })).to.equal(12.5);
  });

  it("should strip non-digit characters between digits", () => {
    expect(toNumber({ value: "123abc456" })).to.equal(123456);
  });

  it("should strip currency symbols and whitespace", () => {
    expect(toNumber({ value: "$ 1,234.56" })).to.equal(1234.56);
  });

  it("should parse pt-BR currency strings", () => {
    expect(toNumber({ value: "R$ 1.500,00", locale: "pt-BR" })).to.equal(1500);
  });

  it("should parse pt-BR decimals", () => {
    expect(toNumber({ value: "12,5", locale: "pt-BR" })).to.equal(12.5);
  });

  it("should treat the locale group separator as a thousands separator", () => {
    expect(toNumber({ value: "1.234.567,89", locale: "pt-BR" })).to.equal(
      1234567.89,
    );
    expect(toNumber({ value: "1,234,567.89", locale: "en-US" })).to.equal(
      1234567.89,
    );
  });

  it("should handle negative values with a leading minus", () => {
    expect(toNumber({ value: "-12.5" })).to.equal(-12.5);
    expect(toNumber({ value: "-R$ 1.500,00", locale: "pt-BR" })).to.equal(
      -1500,
    );
  });

  it("should handle the Unicode minus sign", () => {
    expect(toNumber({ value: "−42" })).to.equal(-42);
  });

  it("should not treat a minus after the first digit as a sign", () => {
    expect(toNumber({ value: "12-34" })).to.equal(1234);
  });

  it("should parse values starting with a decimal separator", () => {
    expect(toNumber({ value: ".5" })).to.equal(0.5);
    expect(toNumber({ value: ",5", locale: "pt-BR" })).to.equal(0.5);
  });

  it("should preserve trailing fractional zeros as a numeric value", () => {
    expect(toNumber({ value: "1.50" })).to.equal(1.5);
  });

  it("should throw if value is not a string", () => {
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: 123 })).to.throw(
      "The 'value' parameter must be a string",
    );
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: null })).to.throw(
      "The 'value' parameter must be a string",
    );
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: undefined })).to.throw(
      "The 'value' parameter must be a string",
    );
  });

  it("should throw on an empty string", () => {
    expect(() => toNumber({ value: "" })).to.throw(
      "must contain at least one digit",
    );
  });

  it("should throw when the string contains no digits", () => {
    expect(() => toNumber({ value: "abc" })).to.throw(
      "must contain at least one digit",
    );
    expect(() => toNumber({ value: "R$ ," })).to.throw(
      "must contain at least one digit",
    );
  });

  it("should throw when the cleaned value cannot be parsed", () => {
    expect(() => toNumber({ value: "1.2.3" })).to.throw("Failed to parse");
  });

  it("should strip non-ASCII digit scripts (Arabic-Indic, Devanagari)", () => {
    expect(() => toNumber({ value: "١٢٣" })).to.throw(
      "must contain at least one digit",
    );
    expect(() => toNumber({ value: "१२३" })).to.throw(
      "must contain at least one digit",
    );
  });

  it("should treat scientific notation 'e' as a stripped character (documented limitation)", () => {
    expect(toNumber({ value: "1e5" })).to.equal(15);
  });

  it("should truncate long error payloads to avoid log spam", () => {
    const huge = "x".repeat(1000);
    try {
      toNumber({ value: huge });
      expect.fail("expected throw");
    } catch (err) {
      expect((err as Error).message.length).to.be.lessThan(150);
    }
  });

  it("should not split surrogate pairs when truncating error payloads", () => {
    // 64 BMP chars followed by an emoji (surrogate pair) at the truncation boundary.
    const value = `${"x".repeat(63)}🦊trailing`;
    try {
      toNumber({ value });
      expect.fail("expected throw");
    } catch (err) {
      const msg = (err as Error).message;
      // The emoji must appear intact, never as a lone surrogate escape.
      expect(msg).to.include("🦊");
      expect(msg).to.not.match(/\\ud[89ab][0-9a-f]{2}/i);
    }
  });

  it("should cap the separator cache at SEPARATOR_CACHE_MAX with FIFO eviction", () => {
    __separatorCache.clear();
    for (let i = 0; i < __SEPARATOR_CACHE_MAX * 4; i++) {
      const locale = `en-US-x-test${i}`;
      expect(toNumber({ value: "12.5", locale })).to.equal(12.5);
    }
    expect(__separatorCache.size).to.equal(__SEPARATOR_CACHE_MAX);
    // FIFO: earliest entries evicted; newest entries kept.
    expect(__separatorCache.has("en-US-x-test0")).to.equal(false);
    expect(
      __separatorCache.has(`en-US-x-test${__SEPARATOR_CACHE_MAX * 4 - 1}`),
    ).to.equal(true);
  });

  it("should reuse a cached separator across calls without growing the cache", () => {
    __separatorCache.clear();
    toNumber({ value: "12.5", locale: "en-US" });
    const sizeAfterFirst = __separatorCache.size;
    for (let i = 0; i < 100; i++) {
      toNumber({ value: "12.5", locale: "en-US" });
    }
    expect(__separatorCache.size).to.equal(sizeAfterFirst);
  });
});
