import { expect } from "chai";
import { describe, it } from "mocha";
import { isNil } from "./index.js";

describe("isNil", () => {
  it("returns true for null", () => {
    expect(isNil({ value: null })).to.equal(true);
  });

  it("returns true for undefined", () => {
    expect(isNil({ value: undefined })).to.equal(true);
  });

  it("returns true for void 0", () => {
    expect(isNil({ value: void 0 })).to.equal(true);
  });

  it("returns false for 0", () => {
    expect(isNil({ value: 0 })).to.equal(false);
  });

  it("returns false for empty string", () => {
    expect(isNil({ value: "" })).to.equal(false);
  });

  it("returns false for false", () => {
    expect(isNil({ value: false })).to.equal(false);
  });

  it("returns false for NaN", () => {
    expect(isNil({ value: Number.NaN })).to.equal(false);
  });

  it("returns false for empty array", () => {
    expect(isNil({ value: [] })).to.equal(false);
  });

  it("returns false for empty object", () => {
    expect(isNil({ value: {} })).to.equal(false);
  });

  it("returns false for a function", () => {
    expect(isNil({ value: () => undefined })).to.equal(false);
  });

  it("returns false for a Symbol", () => {
    expect(isNil({ value: Symbol("s") })).to.equal(false);
  });

  it("returns false for a bigint zero", () => {
    expect(isNil({ value: 0n })).to.equal(false);
  });
});
