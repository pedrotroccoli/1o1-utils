import { expect } from "chai";
import { describe, it } from "mocha";
import { slugify } from "./index.js";

describe("slugify", () => {
  it("should convert a string to a URL-friendly slug", () => {
    const result = slugify({ str: "Hello World!" });

    expect(result).to.equal("hello-world");
  });

  it("should handle accented characters", () => {
    const result = slugify({ str: "São Paulo" });

    expect(result).to.equal("sao-paulo");
  });

  it("should collapse multiple spaces into a single hyphen", () => {
    const result = slugify({ str: "  multiple   spaces  " });

    expect(result).to.equal("multiple-spaces");
  });

  it("should return the same string if already a slug", () => {
    const result = slugify({ str: "already-a-slug" });

    expect(result).to.equal("already-a-slug");
  });

  it("should convert uppercase to lowercase", () => {
    const result = slugify({ str: "UPPERCASE" });

    expect(result).to.equal("uppercase");
  });

  it("should handle special characters", () => {
    const result = slugify({ str: "special!@#chars" });

    expect(result).to.equal("special-chars");
  });

  it("should return an empty string for an empty input", () => {
    const result = slugify({ str: "" });

    expect(result).to.equal("");
  });

  it("should handle strings with only special characters", () => {
    const result = slugify({ str: "!@#$%^&*()" });

    expect(result).to.equal("");
  });

  it("should throw an error if str is not a string", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => slugify({ str: 123 })).to.throw(
      "The 'str' parameter must be a string",
    );
  });
});
