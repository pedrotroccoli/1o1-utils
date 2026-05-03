import { expect } from "chai";
import { describe, it } from "mocha";
import { compact } from "./index.js";

describe("compact", () => {
  it("should remove all falsy values by default", () => {
    const result = compact({
      obj: { a: 1, b: null, c: "", d: 0, e: false, f: "ok" },
    });

    expect(result).to.deep.equal({ a: 1, f: "ok" });
  });

  it("should remove undefined and NaN", () => {
    const result = compact({
      obj: { a: undefined, b: Number.NaN, c: 1 },
    });

    expect(result).to.deep.equal({ c: 1 });
  });

  it("should remove 0n (BigInt zero)", () => {
    const result = compact({
      obj: { a: 0n, b: 1n },
    });

    expect(result).to.deep.equal({ b: 1n });
  });

  it("should preserve falsy values listed in keep", () => {
    const result = compact({
      obj: { a: 0, b: null, c: "" },
      keep: [0],
    });

    expect(result).to.deep.equal({ a: 0 });
  });

  it("should preserve multiple kept falsy values", () => {
    const result = compact({
      obj: { a: 0, b: false, c: "", d: null, e: 1 },
      keep: [0, false, ""],
    });

    expect(result).to.deep.equal({ a: 0, b: false, c: "", e: 1 });
  });

  it("should match NaN in keep via Object.is", () => {
    const result = compact({
      obj: { a: Number.NaN, b: 1 },
      keep: [Number.NaN],
    });

    expect(result).to.deep.equal({ a: Number.NaN, b: 1 });
  });

  it("should distinguish 0 from -0 via Object.is", () => {
    const resultKeepZero = compact({
      obj: { a: 0, b: -0 },
      keep: [0],
    });

    expect(Object.is(resultKeepZero.a, 0)).to.equal(true);
    expect(resultKeepZero).to.not.have.property("b");
  });

  it("should keep all truthy values regardless of keep", () => {
    const result = compact({
      obj: { a: 1, b: "x", c: true, d: {} },
    });

    expect(result).to.deep.equal({ a: 1, b: "x", c: true, d: {} });
  });

  it("should return an empty object when all values are falsy and keep is empty", () => {
    const result = compact({
      obj: { a: null, b: undefined, c: 0 },
    });

    expect(result).to.deep.equal({});
  });

  it("should return an empty object when source is empty", () => {
    const result = compact({ obj: {} as Record<string, unknown> });

    expect(result).to.deep.equal({});
  });

  it("should return a new object, not a reference to the original", () => {
    const obj = { a: 1, b: 2 };
    const result = compact({ obj });

    expect(result).to.not.equal(obj);
  });

  it("should ignore keep when it is an empty array", () => {
    const result = compact({
      obj: { a: 0, b: null, c: 1 },
      keep: [],
    });

    expect(result).to.deep.equal({ c: 1 });
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

    const result = compact({ obj });

    expect(result).to.deep.equal({ safe: 1 });
    expect(({} as Record<string, unknown>).polluted).to.equal(undefined);
  });

  it("should throw an error if obj is not an object", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      compact({ obj: "not an object" }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if obj is null", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      compact({ obj: null }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw an error if keep is not an array", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      compact({ obj: { a: 1 }, keep: "not an array" }),
    ).to.throw("The 'keep' parameter is not an array");
  });
});
