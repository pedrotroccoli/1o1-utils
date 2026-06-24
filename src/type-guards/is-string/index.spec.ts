import { expect } from "chai";
import { describe, it } from "mocha";
import { isString } from "./index.js";

describe("isString", () => {
  it("returns true for an empty string", () => {
    expect(isString("")).to.equal(true);
  });

  it("returns true for a non-empty string", () => {
    expect(isString("hello")).to.equal(true);
  });

  it("returns true for a template literal", () => {
    expect(isString(`tpl`)).to.equal(true);
  });

  it("returns false for a number", () => {
    expect(isString(0)).to.equal(false);
    expect(isString(42)).to.equal(false);
    expect(isString(Number.NaN)).to.equal(false);
  });

  it("returns false for a boolean", () => {
    expect(isString(true)).to.equal(false);
    expect(isString(false)).to.equal(false);
  });

  it("returns false for null", () => {
    expect(isString(null)).to.equal(false);
  });

  it("returns false for undefined", () => {
    expect(isString(undefined)).to.equal(false);
  });

  it("returns false for an array", () => {
    expect(isString([])).to.equal(false);
    expect(isString(["a"])).to.equal(false);
  });

  it("returns false for a plain object", () => {
    expect(isString({})).to.equal(false);
  });

  it("returns false for a boxed String object", () => {
    expect(isString(new String("boxed"))).to.equal(false);
  });

  it("returns false for a symbol", () => {
    expect(isString(Symbol("s"))).to.equal(false);
  });

  it("returns false for a function", () => {
    expect(isString(() => undefined)).to.equal(false);
  });

  it("returns false for a bigint", () => {
    expect(isString(0n)).to.equal(false);
  });

  it("narrows the type to string in the truthy branch", () => {
    const value: unknown = "hello";
    if (isString(value)) {
      // Compile-time narrowing — `.toUpperCase` requires `string`
      expect(value.toUpperCase()).to.equal("HELLO");
    } else {
      expect.fail("expected isString to narrow value");
    }
  });
});
