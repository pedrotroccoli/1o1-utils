import { expect } from "chai";
import { describe, it } from "mocha";
import { isValidEmail } from "./index.js";

describe("isValidEmail", () => {
  describe("valid emails", () => {
    it("should return true for a plain address", () => {
      expect(isValidEmail({ email: "user@example.com" })).to.equal(true);
    });

    it("should return true for a plus-tag address", () => {
      expect(isValidEmail({ email: "user+tag@gmail.com" })).to.equal(true);
    });

    it("should return true for a dotted local part", () => {
      expect(isValidEmail({ email: "first.last@example.com" })).to.equal(true);
    });

    it("should return true for a subdomain host", () => {
      expect(isValidEmail({ email: "user@mail.sub.example.io" })).to.equal(
        true,
      );
    });

    it("should return true for a hyphenated host label", () => {
      expect(isValidEmail({ email: "user@my-host.example.com" })).to.equal(
        true,
      );
    });

    it("should return true for a numeric local part", () => {
      expect(isValidEmail({ email: "12345@example.com" })).to.equal(true);
    });

    it("should return true for a single-char local part", () => {
      expect(isValidEmail({ email: "a@example.com" })).to.equal(true);
    });

    it("should return true for special chars allowed in local part", () => {
      expect(
        isValidEmail({ email: "a!#$%&'*+/=?^_`{|}~-b@example.com" }),
      ).to.equal(true);
    });

    it("should return true for a single-letter TLD", () => {
      expect(isValidEmail({ email: "user@a.b" })).to.equal(true);
    });
  });

  describe("invalid emails", () => {
    it("should return false for missing @", () => {
      expect(isValidEmail({ email: "no-at-sign.com" })).to.equal(false);
    });

    it("should return false for missing domain", () => {
      expect(isValidEmail({ email: "user@" })).to.equal(false);
    });

    it("should return false for missing local part", () => {
      expect(isValidEmail({ email: "@example.com" })).to.equal(false);
    });

    it("should return false for double @", () => {
      expect(isValidEmail({ email: "a@b@example.com" })).to.equal(false);
    });

    it("should return false for a host starting with hyphen", () => {
      expect(isValidEmail({ email: "user@-example.com" })).to.equal(false);
    });

    it("should return false for a host ending with hyphen", () => {
      expect(isValidEmail({ email: "user@example-.com" })).to.equal(false);
    });

    it("should return false for a host with empty label", () => {
      expect(isValidEmail({ email: "user@example..com" })).to.equal(false);
    });

    it("should return false for whitespace inside", () => {
      expect(isValidEmail({ email: "user name@example.com" })).to.equal(false);
    });

    it("should return false for a leading space", () => {
      expect(isValidEmail({ email: " user@example.com" })).to.equal(false);
    });

    it("should return false for a trailing space", () => {
      expect(isValidEmail({ email: "user@example.com " })).to.equal(false);
    });

    it("should return false for a control character", () => {
      expect(isValidEmail({ email: "user\n@example.com" })).to.equal(false);
    });

    it("should return false for empty string", () => {
      expect(isValidEmail({ email: "" })).to.equal(false);
    });

    it("should return false when local part exceeds 64 chars", () => {
      const local = "a".repeat(65);
      expect(isValidEmail({ email: `${local}@example.com` })).to.equal(false);
    });

    it("should return false when total exceeds 254 chars", () => {
      const local = "a".repeat(64);
      const host = `${"b".repeat(60)}.${"c".repeat(60)}.${"d".repeat(60)}.example.com`;
      const long = `${local}@${host}`;
      expect(long.length).to.be.greaterThan(254);
      expect(isValidEmail({ email: long })).to.equal(false);
    });

    it("should return false when input exceeds 320 chars", () => {
      const huge = "a".repeat(321);
      expect(isValidEmail({ email: huge })).to.equal(false);
    });

    it("should reject pathological input quickly via input cap", () => {
      const huge = `${"a".repeat(500)}@example.com`;
      expect(isValidEmail({ email: huge })).to.equal(false);
    });
  });

  describe("internationalized domains (IDN)", () => {
    it("should return false for a Unicode host (no IDN support)", () => {
      expect(isValidEmail({ email: "user@münchen.de" })).to.equal(false);
    });

    it("should return false for a Unicode local part", () => {
      expect(isValidEmail({ email: "üser@example.com" })).to.equal(false);
    });

    it("should return true for a Punycode-encoded host", () => {
      expect(isValidEmail({ email: "user@xn--mnchen-3ya.de" })).to.equal(true);
    });
  });

  describe("HTML5 vs RFC 5322 dot rules", () => {
    it("should accept consecutive dots in local part (HTML5 spec)", () => {
      expect(isValidEmail({ email: "a..b@example.com" })).to.equal(true);
    });

    it("should accept leading dot in local part (HTML5 spec)", () => {
      expect(isValidEmail({ email: ".user@example.com" })).to.equal(true);
    });

    it("should accept trailing dot in local part (HTML5 spec)", () => {
      expect(isValidEmail({ email: "user.@example.com" })).to.equal(true);
    });
  });

  describe("non-string inputs", () => {
    it("should return false for null", () => {
      expect(isValidEmail({ email: null })).to.equal(false);
    });

    it("should return false for undefined", () => {
      expect(isValidEmail({ email: undefined })).to.equal(false);
    });

    it("should return false for a number", () => {
      expect(isValidEmail({ email: 42 })).to.equal(false);
    });

    it("should return false for a boolean", () => {
      expect(isValidEmail({ email: true })).to.equal(false);
    });

    it("should return false for an object", () => {
      expect(isValidEmail({ email: { address: "user@example.com" } })).to.equal(
        false,
      );
    });

    it("should return false for an array", () => {
      expect(isValidEmail({ email: ["user@example.com"] })).to.equal(false);
    });
  });

  describe("allowDisplayName", () => {
    it("should reject display-name form by default", () => {
      expect(isValidEmail({ email: "Jane Doe <jane@example.com>" })).to.equal(
        false,
      );
    });

    it("should accept display-name form when allowed", () => {
      expect(
        isValidEmail({
          email: "Jane Doe <jane@example.com>",
          allowDisplayName: true,
        }),
      ).to.equal(true);
    });

    it("should accept quoted display name when allowed", () => {
      expect(
        isValidEmail({
          email: '"Doe, Jane" <jane@example.com>',
          allowDisplayName: true,
        }),
      ).to.equal(true);
    });

    it("should reject empty bracket when allowed", () => {
      expect(
        isValidEmail({
          email: "Jane <>",
          allowDisplayName: true,
        }),
      ).to.equal(false);
    });

    it("should reject malformed display name (missing close bracket)", () => {
      expect(
        isValidEmail({
          email: "Jane <jane@example.com",
          allowDisplayName: true,
        }),
      ).to.equal(false);
    });

    it("should reject invalid bracketed address when allowed", () => {
      expect(
        isValidEmail({
          email: "Jane <not-an-email>",
          allowDisplayName: true,
        }),
      ).to.equal(false);
    });

    it("should still accept plain address when allowed", () => {
      expect(
        isValidEmail({
          email: "user@example.com",
          allowDisplayName: true,
        }),
      ).to.equal(true);
    });
  });
});
