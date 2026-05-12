import { expect } from "chai";
import { describe, it } from "mocha";
import { generateString } from "./index.js";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const HEX = "0123456789abcdef";

function escapeForCharClass(s: string): string {
  return s.replace(/[\\\]^-]/g, "\\$&");
}

function inPool(str: string, pool: string): boolean {
  const re = new RegExp(`^[${escapeForCharClass(pool)}]*$`);
  return re.test(str);
}

describe("generateString", () => {
  describe("length", () => {
    it("should produce a string of the requested length for default charset", () => {
      const result = generateString({ length: 16 });
      expect(result).to.have.lengthOf(16);
    });

    it("should produce a string of length 0 (empty)", () => {
      const result = generateString({ length: 0 });
      expect(result).to.equal("");
    });

    it("should produce long strings reliably", () => {
      const result = generateString({ length: 4096, charset: "alphanumeric" });
      expect(result).to.have.lengthOf(4096);
    });
  });

  describe("charsets", () => {
    it("should default to charset 'all' when omitted", () => {
      const result = generateString({ length: 64 });
      expect(inPool(result, LOWER + UPPER + DIGITS + SYMBOLS)).to.equal(true);
    });

    it("should produce only alphanumeric chars", () => {
      const result = generateString({
        length: 256,
        charset: "alphanumeric",
      });
      expect(inPool(result, LOWER + UPPER + DIGITS)).to.equal(true);
    });

    it("should produce only alpha chars", () => {
      const result = generateString({ length: 256, charset: "alpha" });
      expect(inPool(result, LOWER + UPPER)).to.equal(true);
    });

    it("should produce only numeric chars", () => {
      const result = generateString({ length: 256, charset: "numeric" });
      expect(inPool(result, DIGITS)).to.equal(true);
    });

    it("should produce only hex chars", () => {
      const result = generateString({ length: 256, charset: "hex" });
      expect(inPool(result, HEX)).to.equal(true);
    });
  });

  describe("custom charset", () => {
    it("should produce only chars from the provided pool", () => {
      const result = generateString({
        length: 64,
        charset: "custom",
        chars: "ABC123",
      });
      expect(inPool(result, "ABC123")).to.equal(true);
    });

    it("should accept a single-char pool and repeat it", () => {
      const result = generateString({
        length: 8,
        charset: "custom",
        chars: "x",
      });
      expect(result).to.equal("xxxxxxxx");
    });

    it("should dedupe chars when dedupe: true", () => {
      const result = generateString({
        length: 64,
        charset: "custom",
        chars: "aabbcc",
        dedupe: true,
      });
      expect(inPool(result, "abc")).to.equal(true);
    });

    it("should respect minChars and accept when chars are sufficient", () => {
      const result = generateString({
        length: 16,
        charset: "custom",
        chars: "ABC",
        minChars: 3,
      });
      expect(result).to.have.lengthOf(16);
      expect(inPool(result, "ABC")).to.equal(true);
    });

    it("should throw when chars are below minChars", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "AB",
          minChars: 3,
        }),
      ).to.throw("at least 3");
    });

    it("should count minChars against unique chars when dedupe: true", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "aaaa",
          dedupe: true,
          minChars: 2,
        }),
      ).to.throw("at least 2");
    });
  });

  describe("randomness", () => {
    it("should produce 1000 unique 16-char strings", () => {
      const set = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        set.add(generateString({ length: 16, charset: "alphanumeric" }));
      }
      expect(set.size).to.equal(1000);
    });

    it("should cover every digit in a large numeric sample", () => {
      const sample = generateString({ length: 10_000, charset: "numeric" });
      for (const d of DIGITS) {
        expect(sample.includes(d)).to.equal(true);
      }
    });
  });

  describe("invalid length", () => {
    it("should throw if length is not a number", () => {
      // @ts-expect-error - testing invalid input
      expect(() => generateString({ length: "16" })).to.throw(
        "The 'length' parameter must be a number",
      );
    });

    it("should throw if length is NaN", () => {
      expect(() => generateString({ length: Number.NaN })).to.throw(
        "The 'length' parameter must not be NaN",
      );
    });

    it("should throw if length is not an integer", () => {
      expect(() => generateString({ length: 1.5 })).to.throw(
        "The 'length' parameter must be an integer",
      );
    });

    it("should throw if length is negative", () => {
      expect(() => generateString({ length: -1 })).to.throw(
        "The 'length' parameter must be ≥ 0",
      );
    });

    it("should throw if length is Infinity", () => {
      expect(() =>
        generateString({ length: Number.POSITIVE_INFINITY }),
      ).to.throw("The 'length' parameter must be an integer");
    });

    it("should throw if length exceeds the maximum (1_000_000)", () => {
      expect(() => generateString({ length: 1_000_001 })).to.throw(
        "The 'length' parameter must not exceed 1000000",
      );
    });
  });

  describe("invalid charset", () => {
    it("should throw if charset is unknown", () => {
      expect(() =>
        // @ts-expect-error - testing invalid input
        generateString({ length: 16, charset: "ascii" }),
      ).to.throw("The 'charset' parameter must be one of");
    });

    it("should throw if chars is passed with a non-custom charset", () => {
      expect(() =>
        generateString({ length: 16, charset: "hex", chars: "abc" }),
      ).to.throw("'chars' parameter is only valid when charset is 'custom'");
    });

    it("should throw if dedupe is passed with a non-custom charset", () => {
      expect(() =>
        generateString({ length: 16, charset: "hex", dedupe: true }),
      ).to.throw("'dedupe' parameter is only valid when charset is 'custom'");
    });

    it("should throw if minChars is passed with a non-custom charset", () => {
      expect(() =>
        generateString({ length: 16, charset: "hex", minChars: 2 }),
      ).to.throw("'minChars' parameter is only valid when charset is 'custom'");
    });
  });

  describe("unicode in custom charset", () => {
    it("should treat emoji as one code point in the pool", () => {
      const result = generateString({
        length: 32,
        charset: "custom",
        chars: "🙂🚀🎉",
      });
      const points = [...result];
      expect(points).to.have.lengthOf(32);
      for (const p of points) {
        expect(["🙂", "🚀", "🎉"]).to.include(p);
      }
    });

    it("should dedupe emoji code points correctly", () => {
      const result = generateString({
        length: 16,
        charset: "custom",
        chars: "🙂🙂🚀",
        dedupe: true,
      });
      const unique = new Set([...result]);
      for (const p of unique) {
        expect(["🙂", "🚀"]).to.include(p);
      }
    });

    it("should count minChars against unique code points for emoji", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "🙂🙂🙂",
          dedupe: true,
          minChars: 2,
        }),
      ).to.throw("at least 2");
    });
  });

  describe("invalid custom inputs", () => {
    it("should throw if charset is custom and chars is missing", () => {
      expect(() => generateString({ length: 16, charset: "custom" })).to.throw(
        "'chars' parameter must be a string",
      );
    });

    it("should throw if chars is not a string", () => {
      expect(() =>
        // @ts-expect-error - testing invalid input
        generateString({ length: 16, charset: "custom", chars: 123 }),
      ).to.throw("'chars' parameter must be a string");
    });

    it("should throw if chars is empty", () => {
      expect(() =>
        generateString({ length: 16, charset: "custom", chars: "" }),
      ).to.throw("'chars' parameter must not be empty");
    });

    it("should throw if dedupe is not a boolean", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "abc",
          // @ts-expect-error - testing invalid input
          dedupe: "yes",
        }),
      ).to.throw("'dedupe' parameter must be a boolean");
    });

    it("should throw if minChars is not an integer", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "abc",
          minChars: 1.5,
        }),
      ).to.throw("'minChars' parameter must be an integer ≥ 1");
    });

    it("should throw if minChars is less than 1", () => {
      expect(() =>
        generateString({
          length: 16,
          charset: "custom",
          chars: "abc",
          minChars: 0,
        }),
      ).to.throw("'minChars' parameter must be an integer ≥ 1");
    });
  });
});
