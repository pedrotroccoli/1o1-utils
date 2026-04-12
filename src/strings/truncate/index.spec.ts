import { expect } from "chai";
import { describe, it } from "mocha";
import { truncate } from "./index.js";

describe("truncate", () => {
  it("should truncate a string to the given length with default suffix", () => {
    const result = truncate({ str: "Hello World", length: 5 });

    expect(result).to.equal("Hello...");
  });

  it("should truncate a string with a custom suffix", () => {
    const result = truncate({ str: "Hello World", length: 5, suffix: " →" });

    expect(result).to.equal("Hello →");
  });

  it("should return the string as-is when shorter than length", () => {
    const result = truncate({ str: "Hi", length: 10 });

    expect(result).to.equal("Hi");
  });

  it("should return the string as-is when exactly at length", () => {
    const result = truncate({ str: "Hello", length: 5 });

    expect(result).to.equal("Hello");
  });

  it("should handle an empty string", () => {
    const result = truncate({ str: "", length: 5 });

    expect(result).to.equal("");
  });

  it("should allow an empty suffix", () => {
    const result = truncate({ str: "Hello World", length: 5, suffix: "" });

    expect(result).to.equal("Hello");
  });

  it("should throw an error if str is not a string", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => truncate({ str: 123, length: 5 })).to.throw(
      "The 'str' parameter must be a string",
    );
  });

  it("should throw an error if length is zero", () => {
    expect(() => truncate({ str: "Hello", length: 0 })).to.throw(
      "The 'length' parameter must be a positive integer",
    );
  });

  it("should throw an error if length is negative", () => {
    expect(() => truncate({ str: "Hello", length: -1 })).to.throw(
      "The 'length' parameter must be a positive integer",
    );
  });

  it("should throw an error if length is not an integer", () => {
    expect(() => truncate({ str: "Hello", length: 2.5 })).to.throw(
      "The 'length' parameter must be a positive integer",
    );
  });
});
