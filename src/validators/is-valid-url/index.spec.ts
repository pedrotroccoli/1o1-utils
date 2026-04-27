import { expect } from "chai";
import { describe, it } from "mocha";
import { isValidUrl } from "./index.js";

describe("isValidUrl", () => {
  describe("valid URLs", () => {
    it("should return true for https URL", () => {
      expect(isValidUrl({ url: "https://example.com" })).to.equal(true);
    });

    it("should return true for http URL", () => {
      expect(isValidUrl({ url: "http://example.com" })).to.equal(true);
    });

    it("should return true for localhost with port", () => {
      expect(isValidUrl({ url: "http://localhost:3000" })).to.equal(true);
    });

    it("should return true for ftp URL", () => {
      expect(isValidUrl({ url: "ftp://files.example.com" })).to.equal(true);
    });

    it("should return true for URL with path, query, and fragment", () => {
      expect(
        isValidUrl({ url: "https://example.com/path?q=1&x=2#section" }),
      ).to.equal(true);
    });

    it("should return true for URL with credentials", () => {
      expect(isValidUrl({ url: "https://user:pass@example.com" })).to.equal(
        true,
      );
    });

    it("should return true for URL with IPv4 host", () => {
      expect(isValidUrl({ url: "http://127.0.0.1:8080" })).to.equal(true);
    });

    it("should return true for URL with IPv6 host", () => {
      expect(isValidUrl({ url: "http://[::1]:8080" })).to.equal(true);
    });

    it("should return true for file URL", () => {
      expect(isValidUrl({ url: "file:///etc/hosts" })).to.equal(true);
    });

    it("should return true for data URL", () => {
      expect(isValidUrl({ url: "data:text/plain,hello" })).to.equal(true);
    });

    it("should return true for mailto URL", () => {
      expect(isValidUrl({ url: "mailto:user@example.com" })).to.equal(true);
    });

    it("should return true for unicode host", () => {
      expect(isValidUrl({ url: "https://例え.jp" })).to.equal(true);
    });
  });

  describe("invalid URLs", () => {
    it("should return false for plain text", () => {
      expect(isValidUrl({ url: "not-a-url" })).to.equal(false);
    });

    it("should return false for empty string", () => {
      expect(isValidUrl({ url: "" })).to.equal(false);
    });

    it("should return false for protocol-relative URL", () => {
      expect(isValidUrl({ url: "//example.com" })).to.equal(false);
    });

    it("should return false for path-only string", () => {
      expect(isValidUrl({ url: "/some/path" })).to.equal(false);
    });

    it("should return false for bare host", () => {
      expect(isValidUrl({ url: "example.com" })).to.equal(false);
    });

    it("should return false for malformed scheme", () => {
      expect(isValidUrl({ url: "http//example.com" })).to.equal(false);
    });

    it("should return false for malformed IPv6 host", () => {
      expect(isValidUrl({ url: "http://[::1" })).to.equal(false);
    });
  });

  describe("non-string inputs", () => {
    it("should return false for null", () => {
      expect(isValidUrl({ url: null })).to.equal(false);
    });

    it("should return false for undefined", () => {
      expect(isValidUrl({ url: undefined })).to.equal(false);
    });

    it("should return false for a number", () => {
      expect(isValidUrl({ url: 42 })).to.equal(false);
    });

    it("should return false for a boolean", () => {
      expect(isValidUrl({ url: true })).to.equal(false);
    });

    it("should return false for an object", () => {
      expect(isValidUrl({ url: { href: "https://example.com" } })).to.equal(
        false,
      );
    });

    it("should return false for an array", () => {
      expect(isValidUrl({ url: ["https://example.com"] })).to.equal(false);
    });

    it("should return false for a URL instance (only strings accepted)", () => {
      expect(isValidUrl({ url: new URL("https://example.com") })).to.equal(
        false,
      );
    });
  });
});
