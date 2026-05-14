import { expect } from "chai";
import { describe, it } from "mocha";
import { isNumber } from "./index.js";

describe("isNumber", () => {
  it("returns true for an integer", () => {
    expect(isNumber(0)).to.equal(true);
    expect(isNumber(1)).to.equal(true);
    expect(isNumber(-42)).to.equal(true);
  });

  it("returns true for a float", () => {
    expect(isNumber(1.5)).to.equal(true);
    expect(isNumber(-0.001)).to.equal(true);
  });

  it("returns true for NaN", () => {
    expect(isNumber(Number.NaN)).to.equal(true);
  });

  it("returns true for Infinity and -Infinity", () => {
    expect(isNumber(Number.POSITIVE_INFINITY)).to.equal(true);
    expect(isNumber(Number.NEGATIVE_INFINITY)).to.equal(true);
  });

  it("returns false for a numeric string", () => {
    expect(isNumber("1")).to.equal(false);
    expect(isNumber("")).to.equal(false);
  });

  it("returns false for a bigint", () => {
    expect(isNumber(0n)).to.equal(false);
    expect(isNumber(1n)).to.equal(false);
  });

  it("returns false for a boxed Number object", () => {
    expect(isNumber(new Number(1))).to.equal(false);
  });

  it("returns false for a boolean", () => {
    expect(isNumber(true)).to.equal(false);
    expect(isNumber(false)).to.equal(false);
  });

  it("returns false for null and undefined", () => {
    expect(isNumber(null)).to.equal(false);
    expect(isNumber(undefined)).to.equal(false);
  });

  it("returns false for an array, object, function, symbol", () => {
    expect(isNumber([1])).to.equal(false);
    expect(isNumber({})).to.equal(false);
    expect(isNumber(() => 1)).to.equal(false);
    expect(isNumber(Symbol("s"))).to.equal(false);
  });

  it("narrows the type to number in the truthy branch", () => {
    const value: unknown = 3.14;
    if (isNumber(value)) {
      // Compile-time narrowing — `.toFixed` requires `number`
      expect(value.toFixed(1)).to.equal("3.1");
    } else {
      expect.fail("expected isNumber to narrow value");
    }
  });
});
