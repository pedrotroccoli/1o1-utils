import { expect } from "chai";
import { describe, it } from "mocha";
import { normalizeEmail } from "./index.js";

describe("normalizeEmail", () => {
  describe("trimming and casing", () => {
    it("should trim leading and trailing whitespace", () => {
      expect(normalizeEmail({ email: "  user@example.com  " })).to.equal(
        "user@example.com",
      );
    });

    it("should lowercase the local part", () => {
      expect(normalizeEmail({ email: "User@example.com" })).to.equal(
        "user@example.com",
      );
    });

    it("should lowercase the domain", () => {
      expect(normalizeEmail({ email: "user@Example.COM" })).to.equal(
        "user@example.com",
      );
    });

    it("should trim and lowercase together", () => {
      expect(normalizeEmail({ email: "  User@Email.COM  " })).to.equal(
        "user@email.com",
      );
    });

    it("should be idempotent for already-normalized input", () => {
      const input = "user@example.com";
      expect(normalizeEmail({ email: input })).to.equal(input);
      expect(
        normalizeEmail({ email: normalizeEmail({ email: input }) }),
      ).to.equal(input);
    });
  });

  describe("plus-addressing (default stripPlus: false)", () => {
    it("should preserve +tag by default", () => {
      expect(normalizeEmail({ email: "user+promotions@gmail.com" })).to.equal(
        "user+promotions@gmail.com",
      );
    });

    it("should preserve +tag when stripPlus is explicitly false", () => {
      expect(
        normalizeEmail({ email: "user+1@email.com", stripPlus: false }),
      ).to.equal("user+1@email.com");
    });
  });

  describe("plus-addressing (stripPlus: true)", () => {
    it("should strip +tag from the local part", () => {
      expect(
        normalizeEmail({
          email: "user+promotions@gmail.com",
          stripPlus: true,
        }),
      ).to.equal("user@gmail.com");
    });

    it("should be a no-op when there is no plus in the local part", () => {
      expect(
        normalizeEmail({ email: "user@gmail.com", stripPlus: true }),
      ).to.equal("user@gmail.com");
    });

    it("should strip from the first plus through the @ when multiple pluses exist", () => {
      expect(
        normalizeEmail({
          email: "user+a+b+c@gmail.com",
          stripPlus: true,
        }),
      ).to.equal("user@gmail.com");
    });

    it("should leave a plus in the domain untouched", () => {
      expect(
        normalizeEmail({ email: "user@a+b.com", stripPlus: true }),
      ).to.equal("user@a+b.com");
    });

    it("should still trim and lowercase when stripping", () => {
      expect(
        normalizeEmail({
          email: "  User+Tag@Gmail.COM ",
          stripPlus: true,
        }),
      ).to.equal("user@gmail.com");
    });

    it("should handle empty local segment before plus (e.g. +tag@)", () => {
      expect(
        normalizeEmail({ email: "+tag@example.com", stripPlus: true }),
      ).to.equal("@example.com");
    });
  });

  describe("invalid inputs", () => {
    it("should throw for null", () => {
      expect(() =>
        // @ts-expect-error testing runtime guard
        normalizeEmail({ email: null }),
      ).to.throw(Error, "The 'email' parameter must be a string");
    });

    it("should throw for undefined", () => {
      expect(() =>
        // @ts-expect-error testing runtime guard
        normalizeEmail({ email: undefined }),
      ).to.throw(Error, "The 'email' parameter must be a string");
    });

    it("should throw for a number", () => {
      expect(() =>
        // @ts-expect-error testing runtime guard
        normalizeEmail({ email: 42 }),
      ).to.throw(Error, "The 'email' parameter must be a string");
    });

    it("should throw for an object", () => {
      expect(() =>
        // @ts-expect-error testing runtime guard
        normalizeEmail({ email: {} }),
      ).to.throw(Error, "The 'email' parameter must be a string");
    });

    it("should throw for an empty string", () => {
      expect(() => normalizeEmail({ email: "" })).to.throw(
        Error,
        "The 'email' parameter must not be empty",
      );
    });

    it("should throw for a whitespace-only string", () => {
      expect(() => normalizeEmail({ email: "   " })).to.throw(
        Error,
        "The 'email' parameter must not be empty",
      );
    });
  });
});
