import { expect } from "chai";
import { describe, it } from "mocha";
import { pickBy } from "./index.js";

describe("pickBy", () => {
  it("should pick entries when predicate returns truthy by value", () => {
    const result = pickBy({
      obj: { a: 1, b: null, c: 3 },
      predicate: (v) => v !== null,
    });

    expect(result).to.deep.equal({ a: 1, c: 3 });
  });

  it("should pass key as second predicate argument", () => {
    const result = pickBy({
      obj: { _hidden: 1, visible: 2, _internal: 3 },
      predicate: (_v, k) => !k.startsWith("_"),
    });

    expect(result).to.deep.equal({ visible: 2 });
  });

  it("should return an empty object when predicate is never truthy", () => {
    const result = pickBy({
      obj: { a: 1, b: 2 },
      predicate: () => false,
    });

    expect(result).to.deep.equal({});
  });

  it("should return a full copy when predicate is always truthy", () => {
    const result = pickBy({
      obj: { a: 1, b: 2 },
      predicate: () => true,
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should return an empty object when source is empty", () => {
    const result = pickBy({
      obj: {} as Record<string, unknown>,
      predicate: () => true,
    });

    expect(result).to.deep.equal({});
  });

  it("should return a new object, not a reference to the original", () => {
    const obj = { a: 1, b: 2 };
    const result = pickBy({ obj, predicate: () => true });

    expect(result).to.not.equal(obj);
  });

  it("should throw an error if obj is not an object", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      pickBy({ obj: "not an object", predicate: () => true }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if obj is null", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      pickBy({ obj: null, predicate: () => true }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if predicate is not a function", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      pickBy({ obj: { a: 1 }, predicate: "not a function" }),
    ).to.throw("The 'predicate' parameter is not a function");
  });
});
