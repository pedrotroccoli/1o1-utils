import { expect } from "chai";
import { describe, it } from "mocha";
import { isNullish } from "./index.js";

describe("isNullish", () => {
  it("returns true for null", () => {
    expect(isNullish(null)).to.equal(true);
  });

  it("returns true for undefined", () => {
    expect(isNullish(undefined)).to.equal(true);
  });

  it("returns true for void 0", () => {
    expect(isNullish(void 0)).to.equal(true);
  });

  it("returns false for 0", () => {
    expect(isNullish(0)).to.equal(false);
  });

  it("returns false for an empty string", () => {
    expect(isNullish("")).to.equal(false);
  });

  it("returns false for false", () => {
    expect(isNullish(false)).to.equal(false);
  });

  it("returns false for NaN", () => {
    expect(isNullish(Number.NaN)).to.equal(false);
  });

  it("returns false for an empty array and object", () => {
    expect(isNullish([])).to.equal(false);
    expect(isNullish({})).to.equal(false);
  });

  it("returns false for a function", () => {
    expect(isNullish(() => undefined)).to.equal(false);
  });

  it("returns false for a symbol", () => {
    expect(isNullish(Symbol("s"))).to.equal(false);
  });

  it("returns false for a bigint zero", () => {
    expect(isNullish(0n)).to.equal(false);
  });

  it("narrows the type to null | undefined in the truthy branch", () => {
    const value: string | null | undefined = null;
    if (isNullish(value)) {
      // Compile-time narrowing — assignable to null | undefined
      const narrowed: null | undefined = value;
      expect(narrowed).to.equal(null);
    } else {
      expect.fail("expected isNullish to narrow value");
    }
  });

  it("narrows away null | undefined in the else branch", () => {
    const value: string | null | undefined = "hello";
    if (isNullish(value)) {
      expect.fail("expected non-nullish path");
    } else {
      // Compile-time narrowing — value is `string` here
      expect(value.toUpperCase()).to.equal("HELLO");
    }
  });
});
