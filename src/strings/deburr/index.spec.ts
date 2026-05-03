import { expect } from "chai";
import { describe, it } from "mocha";
import { deburr } from "./index.js";

describe("deburr", () => {
  describe("removes diacritics", () => {
    it("should strip a single accent", () => {
      const result = deburr({ str: "café" });

      expect(result).to.equal("cafe");
    });

    it("should strip accents while preserving case", () => {
      const result = deburr({ str: "São Paulo" });

      expect(result).to.equal("Sao Paulo");
    });

    it("should strip multiple accents in the same string", () => {
      const result = deburr({ str: "résumé" });

      expect(result).to.equal("resume");
    });

    it("should strip diaeresis", () => {
      const result = deburr({ str: "naïve" });

      expect(result).to.equal("naive");
    });

    it("should handle a wide range of Latin diacritics", () => {
      const result = deburr({
        str: "ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïòóôõöùúûüýÿ",
      });

      expect(result).to.equal(
        "AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiiooooouuuuyy",
      );
    });
  });

  describe("passthrough", () => {
    it("should leave plain ASCII unchanged", () => {
      const result = deburr({ str: "hello world" });

      expect(result).to.equal("hello world");
    });

    it("should return an empty string for an empty input", () => {
      const result = deburr({ str: "" });

      expect(result).to.equal("");
    });

    it("should leave non-Latin scripts without combining marks unchanged", () => {
      const result = deburr({ str: "你好 こんにちは" });

      expect(result).to.equal("你好 こんにちは");
    });

    it("should leave characters that do not decompose unchanged", () => {
      const result = deburr({ str: "straße łódź" });

      expect(result).to.equal("straße łodz");
    });
  });

  describe("idempotence", () => {
    it("should produce the same result when applied twice", () => {
      const once = deburr({ str: "São Paulo — résumé" });
      const twice = deburr({ str: once });

      expect(twice).to.equal(once);
    });
  });

  describe("invalid inputs", () => {
    it("should throw an error if str is not a string", () => {
      // @ts-expect-error - we want to test the error case
      expect(() => deburr({ str: 123 })).to.throw(
        "The 'str' parameter must be a string",
      );
    });

    it("should throw an error if str is undefined", () => {
      // @ts-expect-error - we want to test the error case
      expect(() => deburr({ str: undefined })).to.throw(
        "The 'str' parameter must be a string",
      );
    });
  });
});
