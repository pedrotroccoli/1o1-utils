import { expect } from "chai";
import { describe, it } from "mocha";
import { toNumber } from "./index.js";

describe("toNumber", () => {
  it("should parse a plain integer using the default locale", () => {
    expect(toNumber({ value: "123" })).to.equal(123);
  });

  it("should parse a decimal using the default en-US locale", () => {
    expect(toNumber({ value: "12.5" })).to.equal(12.5);
  });

  it("should strip non-digit characters between digits", () => {
    expect(toNumber({ value: "123abc456" })).to.equal(123456);
  });

  it("should strip currency symbols and whitespace", () => {
    expect(toNumber({ value: "$ 1,234.56" })).to.equal(1234.56);
  });

  it("should parse pt-BR currency strings", () => {
    expect(toNumber({ value: "R$ 1.500,00", locale: "pt-BR" })).to.equal(1500);
  });

  it("should parse pt-BR decimals", () => {
    expect(toNumber({ value: "12,5", locale: "pt-BR" })).to.equal(12.5);
  });

  it("should treat the locale group separator as a thousands separator", () => {
    expect(toNumber({ value: "1.234.567,89", locale: "pt-BR" })).to.equal(
      1234567.89,
    );
    expect(toNumber({ value: "1,234,567.89", locale: "en-US" })).to.equal(
      1234567.89,
    );
  });

  it("should handle negative values with a leading minus", () => {
    expect(toNumber({ value: "-12.5" })).to.equal(-12.5);
    expect(toNumber({ value: "-R$ 1.500,00", locale: "pt-BR" })).to.equal(
      -1500,
    );
  });

  it("should handle the Unicode minus sign", () => {
    expect(toNumber({ value: "−42" })).to.equal(-42);
  });

  it("should not treat a minus after the first digit as a sign", () => {
    expect(toNumber({ value: "12-34" })).to.equal(1234);
  });

  it("should parse values starting with a decimal separator", () => {
    expect(toNumber({ value: ".5" })).to.equal(0.5);
    expect(toNumber({ value: ",5", locale: "pt-BR" })).to.equal(0.5);
  });

  it("should preserve trailing fractional zeros as a numeric value", () => {
    expect(toNumber({ value: "1.50" })).to.equal(1.5);
  });

  it("should throw if value is not a string", () => {
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: 123 })).to.throw(
      "The 'value' parameter must be a string",
    );
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: null })).to.throw(
      "The 'value' parameter must be a string",
    );
    // @ts-expect-error - testing invalid input
    expect(() => toNumber({ value: undefined })).to.throw(
      "The 'value' parameter must be a string",
    );
  });

  it("should throw on an empty string", () => {
    expect(() => toNumber({ value: "" })).to.throw(
      "must contain at least one digit",
    );
  });

  it("should throw when the string contains no digits", () => {
    expect(() => toNumber({ value: "abc" })).to.throw(
      "must contain at least one digit",
    );
    expect(() => toNumber({ value: "R$ ," })).to.throw(
      "must contain at least one digit",
    );
  });

  it("should throw when the cleaned value cannot be parsed", () => {
    expect(() => toNumber({ value: "1.2.3" })).to.throw("Failed to parse");
  });
});
