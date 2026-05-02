import { expect } from "chai";
import { describe, it } from "mocha";
import { escapeRegExp } from "./index.js";

describe("escapeRegExp", () => {
  it("should escape every regex metacharacter", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: testing literal regex specials
    const result = escapeRegExp({ str: ".*+?^${}()|[]\\" });

    expect(result).to.equal("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  it("should escape brackets and parentheses", () => {
    const result = escapeRegExp({ str: "[hello](world)" });

    expect(result).to.equal("\\[hello\\]\\(world\\)");
  });

  it("should leave a string with no special chars unchanged", () => {
    const result = escapeRegExp({ str: "hello world 123" });

    expect(result).to.equal("hello world 123");
  });

  it("should return an empty string for empty input", () => {
    const result = escapeRegExp({ str: "" });

    expect(result).to.equal("");
  });

  it("should preserve unicode characters", () => {
    const result = escapeRegExp({ str: "héllo 世界 🚀" });

    expect(result).to.equal("héllo 世界 🚀");
  });

  it("should produce a pattern that matches the original literally", () => {
    const input = "a.b*c?(d)+[e]";
    const re = new RegExp(escapeRegExp({ str: input }));

    expect(re.test(input)).to.equal(true);
    expect(re.test("axb")).to.equal(false);
  });

  it("should escape the same character multiple times", () => {
    const result = escapeRegExp({ str: "..." });

    expect(result).to.equal("\\.\\.\\.");
  });

  it("should escape a backslash", () => {
    const result = escapeRegExp({ str: "a\\b" });

    expect(result).to.equal("a\\\\b");
  });

  it("should not escape characters that are not regex specials", () => {
    const result = escapeRegExp({ str: "/-_=:;'\"<>,&%@#" });

    expect(result).to.equal("/-_=:;'\"<>,&%@#");
  });

  it("should throw an error if str is not a string", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => escapeRegExp({ str: 123 })).to.throw(
      "The 'str' parameter must be a string",
    );
  });

  it("should throw an error if str is undefined", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => escapeRegExp({ str: undefined })).to.throw(
      "The 'str' parameter must be a string",
    );
  });
});
