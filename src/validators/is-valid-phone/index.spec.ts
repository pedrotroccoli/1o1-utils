import { expect } from "chai";
import { describe, it } from "mocha";
import { isValidPhone } from "./index.js";

describe("isValidPhone", () => {
  describe("valid phones", () => {
    it("should return true for a plain E.164 number", () => {
      expect(isValidPhone({ phone: "+5511999999999" })).to.equal(true);
    });

    it("should return true for a single-digit country code", () => {
      expect(isValidPhone({ phone: "+15551234567" })).to.equal(true);
    });

    it("should return true for a three-digit country code", () => {
      expect(isValidPhone({ phone: "+5511987654321" })).to.equal(true);
    });

    it("should return true with spaces between groups", () => {
      expect(isValidPhone({ phone: "+1 555 1234567" })).to.equal(true);
    });

    it("should return true with hyphens", () => {
      expect(isValidPhone({ phone: "+1-555-123-4567" })).to.equal(true);
    });

    it("should return true with parentheses", () => {
      expect(isValidPhone({ phone: "+44 (20) 7946 0958" })).to.equal(true);
    });

    it("should return true with dots", () => {
      expect(isValidPhone({ phone: "+1.555.123.4567" })).to.equal(true);
    });

    it("should return true with mixed separators", () => {
      expect(isValidPhone({ phone: "+1 (555) 123-4567" })).to.equal(true);
    });

    it("should return true at exactly 15 digits (E.164 max)", () => {
      expect(isValidPhone({ phone: "+123456789012345" })).to.equal(true);
    });

    it("should return true for a single-digit subscriber", () => {
      expect(isValidPhone({ phone: "+12" })).to.equal(true);
    });

    it("should accept a leading space before + (stripped)", () => {
      expect(isValidPhone({ phone: " +15551234567" })).to.equal(true);
    });
  });

  describe("invalid phones", () => {
    it("should return false without a leading +", () => {
      expect(isValidPhone({ phone: "11999999999" })).to.equal(false);
    });

    it("should return false for a bare +", () => {
      expect(isValidPhone({ phone: "+" })).to.equal(false);
    });

    it("should return false when country code starts with 0", () => {
      expect(isValidPhone({ phone: "+0123456789" })).to.equal(false);
    });

    it("should return false for letters", () => {
      expect(isValidPhone({ phone: "abc" })).to.equal(false);
    });

    it("should return false for letters mixed with digits", () => {
      expect(isValidPhone({ phone: "+1abc4567890" })).to.equal(false);
    });

    it("should return false for an empty string", () => {
      expect(isValidPhone({ phone: "" })).to.equal(false);
    });

    it("should return false for more than 15 digits", () => {
      expect(isValidPhone({ phone: "+1234567890123456" })).to.equal(false);
    });

    it("should return false for a slash separator", () => {
      expect(isValidPhone({ phone: "+1/555/1234567" })).to.equal(false);
    });

    it("should return false for an underscore separator", () => {
      expect(isValidPhone({ phone: "+1_555_1234567" })).to.equal(false);
    });

    it("should return false for input over 32 chars", () => {
      const huge = `+${"1".repeat(40)}`;
      expect(isValidPhone({ phone: huge })).to.equal(false);
    });

    it("should return false for a number embedded in text", () => {
      expect(isValidPhone({ phone: "call +15551234567 now" })).to.equal(false);
    });
  });

  describe("non-string inputs", () => {
    it("should return false for null", () => {
      expect(isValidPhone({ phone: null })).to.equal(false);
    });

    it("should return false for undefined", () => {
      expect(isValidPhone({ phone: undefined })).to.equal(false);
    });

    it("should return false for a number", () => {
      expect(isValidPhone({ phone: 15551234567 })).to.equal(false);
    });

    it("should return false for a boolean", () => {
      expect(isValidPhone({ phone: true })).to.equal(false);
    });

    it("should return false for an object", () => {
      expect(isValidPhone({ phone: { number: "+15551234567" } })).to.equal(
        false,
      );
    });

    it("should return false for an array", () => {
      expect(isValidPhone({ phone: ["+15551234567"] })).to.equal(false);
    });
  });
});
