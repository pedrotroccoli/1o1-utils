import { expect } from "chai";
import { describe, it } from "mocha";
import { isEmpty } from "./index.js";

describe("isEmpty", () => {
  it("should return true for null", () => {
    expect(isEmpty({ value: null })).to.equal(true);
  });

  it("should return true for undefined", () => {
    expect(isEmpty({ value: undefined })).to.equal(true);
  });

  it("should return true for an empty string", () => {
    expect(isEmpty({ value: "" })).to.equal(true);
  });

  it("should return false for a non-empty string", () => {
    expect(isEmpty({ value: "hello" })).to.equal(false);
  });

  it("should return true for an empty array", () => {
    expect(isEmpty({ value: [] })).to.equal(true);
  });

  it("should return false for a non-empty array", () => {
    expect(isEmpty({ value: [1, 2] })).to.equal(false);
  });

  it("should return true for an empty object", () => {
    expect(isEmpty({ value: {} })).to.equal(true);
  });

  it("should return false for a non-empty object", () => {
    expect(isEmpty({ value: { a: 1 } })).to.equal(false);
  });

  it("should return true for an empty Map", () => {
    expect(isEmpty({ value: new Map() })).to.equal(true);
  });

  it("should return false for a non-empty Map", () => {
    expect(isEmpty({ value: new Map([["a", 1]]) })).to.equal(false);
  });

  it("should return true for an empty Set", () => {
    expect(isEmpty({ value: new Set() })).to.equal(true);
  });

  it("should return false for a non-empty Set", () => {
    expect(isEmpty({ value: new Set([1]) })).to.equal(false);
  });

  it("should return true for Object.create(null) with no properties", () => {
    expect(isEmpty({ value: Object.create(null) })).to.equal(true);
  });

  it("should return false for a number", () => {
    expect(isEmpty({ value: 0 })).to.equal(false);
    expect(isEmpty({ value: 42 })).to.equal(false);
  });

  it("should return false for a boolean", () => {
    expect(isEmpty({ value: false })).to.equal(false);
    expect(isEmpty({ value: true })).to.equal(false);
  });

  it("should return false for a function", () => {
    expect(isEmpty({ value: () => {} })).to.equal(false);
  });

  it("should return false for a class instance", () => {
    class Foo {
      x = 1;
    }
    expect(isEmpty({ value: new Foo() })).to.equal(false);
  });
});
