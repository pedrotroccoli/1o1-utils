import { expect } from "chai";
import { describe, it } from "mocha";
import { stringStrength } from "./index.js";

describe("stringStrength", () => {
  describe("issue examples", () => {
    it("should score 'aaaaaa' as very-weak with zero entropy", () => {
      const result = stringStrength({ str: "aaaaaa" });

      expect(result.entropy).to.equal(0);
      expect(result.effectiveEntropy).to.equal(0);
      expect(result.score).to.equal(0);
      expect(result.level).to.equal("very-weak");
    });

    it("should score 'abc123' as fair", () => {
      const result = stringStrength({ str: "abc123" });

      expect(result.entropy).to.be.closeTo(2.585, 0.01);
      expect(result.score).to.equal(2);
      expect(result.level).to.equal("fair");
    });

    it("should score 'Tr0ub4dor&3' as strong", () => {
      const result = stringStrength({ str: "Tr0ub4dor&3" });

      expect(result.entropy).to.be.closeTo(3.277, 0.01);
      expect(result.score).to.equal(4);
      expect(result.level).to.equal("strong");
    });

    it("should score 'correct-horse-battery-staple' as very-strong", () => {
      const result = stringStrength({
        str: "correct-horse-battery-staple",
      });

      expect(result.entropy).to.be.closeTo(3.495, 0.01);
      expect(result.score).to.equal(5);
      expect(result.level).to.equal("very-strong");
    });
  });

  describe("effective entropy", () => {
    it("should equal entropy times length", () => {
      const result = stringStrength({ str: "abc123" });

      expect(result.effectiveEntropy).to.be.closeTo(result.entropy * 6, 1e-9);
    });
  });

  describe("pool detection", () => {
    it("should detect lowercase only", () => {
      const result = stringStrength({ str: "abcdef" });

      expect(result.pools).to.deep.equal(["lowercase"]);
      expect(result.poolCount).to.equal(1);
    });

    it("should detect lowercase and digit", () => {
      const result = stringStrength({ str: "abc123" });

      expect(result.pools).to.deep.equal(["lowercase", "digit"]);
      expect(result.poolCount).to.equal(2);
    });

    it("should detect all four ASCII pools", () => {
      const result = stringStrength({ str: "Tr0ub4dor&3" });

      expect(result.pools).to.deep.equal([
        "lowercase",
        "uppercase",
        "digit",
        "symbol",
      ]);
      expect(result.poolCount).to.equal(4);
    });

    it("should detect unicode pool for non-ASCII", () => {
      const result = stringStrength({ str: "café" });

      expect(result.pools).to.include("lowercase");
      expect(result.pools).to.include("unicode");
    });

    it("should detect symbol for ASCII punctuation", () => {
      const result = stringStrength({ str: "!@#$%^" });

      expect(result.pools).to.deep.equal(["symbol"]);
    });

    it("should keep pools in fixed order regardless of input order", () => {
      const result = stringStrength({ str: "&3aB你" });

      expect(result.pools).to.deep.equal([
        "lowercase",
        "uppercase",
        "digit",
        "symbol",
        "unicode",
      ]);
    });
  });

  describe("unicode handling", () => {
    it("should treat each CJK character as one code point", () => {
      const result = stringStrength({ str: "你好世界" });

      expect(result.entropy).to.be.closeTo(2, 0.01);
      expect(result.pools).to.deep.equal(["unicode"]);
    });

    it("should count emoji as one code point", () => {
      const result = stringStrength({ str: "🙂🙃🙂" });

      expect(result.pools).to.deep.equal(["unicode"]);
      expect(result.entropy).to.be.greaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should return zero values for an empty string", () => {
      const result = stringStrength({ str: "" });

      expect(result).to.deep.equal({
        entropy: 0,
        effectiveEntropy: 0,
        score: 0,
        level: "very-weak",
        pools: [],
        poolCount: 0,
      });
    });

    it("should return zero entropy for a single character", () => {
      const result = stringStrength({ str: "a" });

      expect(result.entropy).to.equal(0);
      expect(result.effectiveEntropy).to.equal(0);
      expect(result.score).to.equal(0);
      expect(result.level).to.equal("very-weak");
      expect(result.pools).to.deep.equal(["lowercase"]);
    });

    it("should rate a 64-char hex string as very-strong", () => {
      const hex = "0123456789abcdef".repeat(4);
      const result = stringStrength({ str: hex });

      expect(result.score).to.equal(5);
      expect(result.level).to.equal("very-strong");
    });

    it("should produce score 1 (weak) for short low-entropy input", () => {
      const result = stringStrength({ str: "ab" });

      expect(result.score).to.equal(1);
      expect(result.level).to.equal("weak");
    });

    it("should produce score 3 (good) for medium effective entropy", () => {
      const result = stringStrength({ str: "abcdefghi" });

      expect(result.score).to.equal(3);
      expect(result.level).to.equal("good");
    });
  });

  describe("invalid inputs", () => {
    it("should throw if str is a number", () => {
      // @ts-expect-error - testing invalid input
      expect(() => stringStrength({ str: 123 })).to.throw(
        "The 'str' parameter must be a string",
      );
    });

    it("should throw if str is undefined", () => {
      // @ts-expect-error - testing invalid input
      expect(() => stringStrength({ str: undefined })).to.throw(
        "The 'str' parameter must be a string",
      );
    });

    it("should throw if str is null", () => {
      // @ts-expect-error - testing invalid input
      expect(() => stringStrength({ str: null })).to.throw(
        "The 'str' parameter must be a string",
      );
    });

    it("should throw if str is an object", () => {
      // @ts-expect-error - testing invalid input
      expect(() => stringStrength({ str: {} })).to.throw(
        "The 'str' parameter must be a string",
      );
    });
  });
});
