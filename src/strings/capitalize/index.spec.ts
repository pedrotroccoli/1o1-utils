import { expect } from "chai";
import { describe, it } from "mocha";
import { capitalize } from "./index.js";

describe("capitalize", () => {
  it("should capitalize the first letter and lowercase the rest", () => {
    const result = capitalize({ str: "hello" });

    expect(result).to.equal("Hello");
  });

  it("should lowercase the rest of the string by default", () => {
    const result = capitalize({ str: "HELLO" });

    expect(result).to.equal("Hello");
  });

  it("should preserve the rest when preserveRest is true", () => {
    const result = capitalize({ str: "hELLO", preserveRest: true });

    expect(result).to.equal("HELLO");
  });

  it("should handle a single character", () => {
    const result = capitalize({ str: "a" });

    expect(result).to.equal("A");
  });

  it("should return an empty string for empty input", () => {
    const result = capitalize({ str: "" });

    expect(result).to.equal("");
  });

  it("should handle strings starting with a number", () => {
    const result = capitalize({ str: "123abc" });

    expect(result).to.equal("123abc");
  });

  it("should capitalize only the first letter of a multi-word string", () => {
    const result = capitalize({ str: "hello world" });

    expect(result).to.equal("Hello world");
  });

  it("should handle already capitalized strings", () => {
    const result = capitalize({ str: "Hello" });

    expect(result).to.equal("Hello");
  });

  it("should throw an error if str is not a string", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => capitalize({ str: 123 })).to.throw(
      "The 'str' parameter must be a string",
    );
  });
});
