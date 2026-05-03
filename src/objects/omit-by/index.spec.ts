import { expect } from "chai";
import { describe, it } from "mocha";
import { omitBy } from "./index.js";

describe("omitBy", () => {
  it("should omit entries when predicate returns truthy by value", () => {
    const result = omitBy({
      obj: { a: 1, b: 2, c: 3 },
      predicate: (v) => v > 1,
    });

    expect(result).to.deep.equal({ a: 1 });
  });

  it("should pass key as second predicate argument", () => {
    const result = omitBy({
      obj: { _hidden: 1, visible: 2, _internal: 3 },
      predicate: (_v, k) => k.startsWith("_"),
    });

    expect(result).to.deep.equal({ visible: 2 });
  });

  it("should return a full copy when predicate is never truthy", () => {
    const result = omitBy({
      obj: { a: 1, b: 2 },
      predicate: () => false,
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should return an empty object when predicate is always truthy", () => {
    const result = omitBy({
      obj: { a: 1, b: 2 },
      predicate: () => true,
    });

    expect(result).to.deep.equal({});
  });

  it("should return an empty object when source is empty", () => {
    const result = omitBy({
      obj: {} as Record<string, unknown>,
      predicate: () => false,
    });

    expect(result).to.deep.equal({});
  });

  it("should return a new object, not a reference to the original", () => {
    const obj = { a: 1, b: 2 };
    const result = omitBy({ obj, predicate: () => false });

    expect(result).to.not.equal(obj);
  });

  it("should coerce truthy/falsy non-boolean predicate returns", () => {
    const result = omitBy({
      obj: { a: 0, b: 1, c: "", d: "ok" },
      // @ts-expect-error - returning the value itself (number/string), not a boolean
      predicate: (v) => v,
    });

    expect(result).to.deep.equal({ a: 0, c: "" });
  });

  it("should skip unsafe keys to prevent prototype pollution", () => {
    const obj: Record<string, unknown> = {};
    Object.defineProperty(obj, "__proto__", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: { polluted: true },
    });
    obj.safe = 1;

    const result = omitBy({ obj, predicate: () => false });

    expect(result).to.deep.equal({ safe: 1 });
    expect(({} as Record<string, unknown>).polluted).to.equal(undefined);
  });

  it("should throw an error if obj is not an object", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      omitBy({ obj: "not an object", predicate: () => false }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if obj is null", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      omitBy({ obj: null, predicate: () => false }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if predicate is not a function", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      omitBy({ obj: { a: 1 }, predicate: "not a function" }),
    ).to.throw("The 'predicate' parameter is not a function");
  });
});
