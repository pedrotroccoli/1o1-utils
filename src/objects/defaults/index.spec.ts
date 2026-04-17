import { expect } from "chai";
import { describe, it } from "mocha";
import { defaults } from "./index.js";

describe("defaults", () => {
  it("should fill missing keys from source", () => {
    const result = defaults({
      target: { a: 1 },
      source: { a: 99, b: 2 },
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should preserve existing values in target", () => {
    const result = defaults({
      target: { a: 1, b: "hello" },
      source: { a: 99, b: "world", c: 3 },
    });

    expect(result).to.deep.equal({ a: 1, b: "hello", c: 3 });
  });

  it("should replace undefined values with source values", () => {
    const result = defaults({
      target: { a: undefined, b: 2 },
      source: { a: 1, b: 99 },
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should preserve null values in target", () => {
    const result = defaults({
      target: { a: null },
      source: { a: 1 },
    });

    expect(result).to.deep.equal({ a: null });
  });

  it("should preserve falsy values (0, '', false) in target", () => {
    const result = defaults({
      target: { a: 0, b: "", c: false },
      source: { a: 1, b: "fallback", c: true },
    });

    expect(result).to.deep.equal({ a: 0, b: "", c: false });
  });

  it("should handle empty target", () => {
    const result = defaults({
      target: {},
      source: { a: 1, b: 2 },
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should handle empty source", () => {
    const result = defaults({
      target: { a: 1, b: 2 },
      source: {},
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should handle both empty objects", () => {
    const result = defaults({ target: {}, source: {} });

    expect(result).to.deep.equal({});
  });

  it("should not mutate the inputs", () => {
    const target = { a: 1 };
    const source = { a: 99, b: 2 };
    const result = defaults({ target, source });

    expect(result).to.not.equal(target);
    expect(result).to.not.equal(source);
    expect(target).to.deep.equal({ a: 1 });
    expect(source).to.deep.equal({ a: 99, b: 2 });
  });

  it("should copy nested objects by reference (shallow)", () => {
    const nested = { x: 1 };
    const result = defaults({
      target: {},
      source: { nested },
    });

    expect(result.nested).to.equal(nested);
  });

  it("should throw if target is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaults({ target: "string", source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if target is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaults({ target: null, source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if target is an array", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaults({ target: [1, 2], source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if source is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaults({ target: {}, source: 42 })).to.throw(
      "The 'source' parameter is not an object",
    );
  });

  it("should throw if source is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaults({ target: {}, source: null })).to.throw(
      "The 'source' parameter is not an object",
    );
  });
});
