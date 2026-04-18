import { expect } from "chai";
import { describe, it } from "mocha";
import { transformCase } from "./index.js";

describe("transformCase", () => {
  describe("to kebab", () => {
    it("should convert camelCase to kebab-case", () => {
      expect(transformCase({ str: "helloWorld", to: "kebab" })).to.equal(
        "hello-world",
      );
    });

    it("should convert PascalCase to kebab-case", () => {
      expect(transformCase({ str: "HelloWorld", to: "kebab" })).to.equal(
        "hello-world",
      );
    });

    it("should convert snake_case to kebab-case", () => {
      expect(transformCase({ str: "hello_world", to: "kebab" })).to.equal(
        "hello-world",
      );
    });

    it("should handle consecutive uppercase (acronyms)", () => {
      expect(transformCase({ str: "HTMLParser", to: "kebab" })).to.equal(
        "html-parser",
      );
    });

    it("should handle mid-word acronyms", () => {
      expect(transformCase({ str: "myXMLParser", to: "kebab" })).to.equal(
        "my-xml-parser",
      );
    });
  });

  describe("to camel", () => {
    it("should convert kebab-case to camelCase", () => {
      expect(transformCase({ str: "hello-world", to: "camel" })).to.equal(
        "helloWorld",
      );
    });

    it("should convert snake_case to camelCase", () => {
      expect(transformCase({ str: "hello_world", to: "camel" })).to.equal(
        "helloWorld",
      );
    });

    it("should convert PascalCase to camelCase", () => {
      expect(transformCase({ str: "HelloWorld", to: "camel" })).to.equal(
        "helloWorld",
      );
    });

    it("should handle multi-word kebab", () => {
      expect(transformCase({ str: "my-component-name", to: "camel" })).to.equal(
        "myComponentName",
      );
    });
  });

  describe("to snake", () => {
    it("should convert camelCase to snake_case", () => {
      expect(transformCase({ str: "helloWorld", to: "snake" })).to.equal(
        "hello_world",
      );
    });

    it("should convert PascalCase to snake_case", () => {
      expect(transformCase({ str: "HelloWorld", to: "snake" })).to.equal(
        "hello_world",
      );
    });

    it("should convert kebab-case to snake_case", () => {
      expect(transformCase({ str: "hello-world", to: "snake" })).to.equal(
        "hello_world",
      );
    });
  });

  describe("to pascal", () => {
    it("should convert camelCase to PascalCase", () => {
      expect(transformCase({ str: "helloWorld", to: "pascal" })).to.equal(
        "HelloWorld",
      );
    });

    it("should convert kebab-case to PascalCase", () => {
      expect(transformCase({ str: "hello-world", to: "pascal" })).to.equal(
        "HelloWorld",
      );
    });

    it("should convert snake_case to PascalCase", () => {
      expect(transformCase({ str: "hello_world", to: "pascal" })).to.equal(
        "HelloWorld",
      );
    });
  });

  describe("to title", () => {
    it("should convert space-separated words to Title Case", () => {
      expect(transformCase({ str: "hello world", to: "title" })).to.equal(
        "Hello World",
      );
    });

    it("should convert kebab-case to Title Case", () => {
      expect(transformCase({ str: "some-kebab-case", to: "title" })).to.equal(
        "Some Kebab Case",
      );
    });

    it("should convert camelCase to Title Case", () => {
      expect(transformCase({ str: "alreadyTitle", to: "title" })).to.equal(
        "Already Title",
      );
    });

    it("should convert snake_case to Title Case", () => {
      expect(transformCase({ str: "hello_world", to: "title" })).to.equal(
        "Hello World",
      );
    });

    it("should handle acronyms by lowercasing them by default", () => {
      expect(transformCase({ str: "HTMLParser", to: "title" })).to.equal(
        "Html Parser",
      );
    });

    it("should return an empty string for empty input", () => {
      expect(transformCase({ str: "", to: "title" })).to.equal("");
    });
  });

  describe("preserveAcronyms", () => {
    it("should preserve acronyms in title case", () => {
      expect(
        transformCase({
          str: "HTMLParser",
          to: "title",
          preserveAcronyms: true,
        }),
      ).to.equal("HTML Parser");
    });

    it("should preserve acronyms in kebab-case (non-acronyms lowercased)", () => {
      expect(
        transformCase({
          str: "HTMLParser",
          to: "kebab",
          preserveAcronyms: true,
        }),
      ).to.equal("HTML-parser");
    });

    it("should preserve acronyms in snake_case (non-acronyms lowercased)", () => {
      expect(
        transformCase({
          str: "HTMLParser",
          to: "snake",
          preserveAcronyms: true,
        }),
      ).to.equal("HTML_parser");
    });

    it("should preserve acronyms in PascalCase", () => {
      expect(
        transformCase({
          str: "HTMLParser",
          to: "pascal",
          preserveAcronyms: true,
        }),
      ).to.equal("HTMLParser");
    });

    it("should lowercase leading acronym in camelCase", () => {
      expect(
        transformCase({
          str: "HTMLParser",
          to: "camel",
          preserveAcronyms: true,
        }),
      ).to.equal("htmlParser");
    });

    it("should preserve mid-word acronyms in camelCase", () => {
      expect(
        transformCase({
          str: "myXMLParser",
          to: "camel",
          preserveAcronyms: true,
        }),
      ).to.equal("myXMLParser");
    });

    it("should preserve mid-word acronyms in title case", () => {
      expect(
        transformCase({
          str: "myXMLParser",
          to: "title",
          preserveAcronyms: true,
        }),
      ).to.equal("My XML Parser");
    });

    it("should default to false (current lowercase behavior)", () => {
      expect(transformCase({ str: "HTMLParser", to: "kebab" })).to.equal(
        "html-parser",
      );
    });
  });

  describe("edge cases", () => {
    it("should return an empty string for empty input", () => {
      expect(transformCase({ str: "", to: "kebab" })).to.equal("");
    });

    it("should handle a single word", () => {
      expect(transformCase({ str: "hello", to: "camel" })).to.equal("hello");
    });

    it("should handle already-correct casing", () => {
      expect(transformCase({ str: "hello-world", to: "kebab" })).to.equal(
        "hello-world",
      );
    });

    it("should handle spaces in input", () => {
      expect(transformCase({ str: "hello world", to: "camel" })).to.equal(
        "helloWorld",
      );
    });
  });

  describe("errors", () => {
    it("should throw an error if str is not a string", () => {
      // @ts-expect-error - we want to test the error case
      expect(() => transformCase({ str: 123, to: "kebab" })).to.throw(
        "The 'str' parameter must be a string",
      );
    });

    it("should throw an error if to is not a valid case style", () => {
      // @ts-expect-error - we want to test the error case
      expect(() => transformCase({ str: "hello", to: "invalid" })).to.throw(
        "The 'to' parameter must be one of",
      );
    });

    it("should list title in the valid styles error message", () => {
      expect(() =>
        // @ts-expect-error - we want to test the error case
        transformCase({ str: "hello", to: "invalid" }),
      ).to.throw("title");
    });
  });
});
