import { expect } from "chai";
import { describe, it } from "mocha";
import { defaultsDeep } from "./index.js";

describe("defaultsDeep", () => {
  it("should fill missing top-level keys from source", () => {
    const result = defaultsDeep({
      target: { a: 1 },
      source: { a: 99, b: 2 },
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should fill missing nested keys recursively", () => {
    const result = defaultsDeep({
      target: { db: { port: 5432 } },
      source: { db: { port: 3306, host: "localhost" }, debug: false },
    });

    expect(result).to.deep.equal({
      db: { port: 5432, host: "localhost" },
      debug: false,
    });
  });

  it("should merge deeply nested objects (3+ levels)", () => {
    const result = defaultsDeep({
      target: { a: { b: { c: { d: 1 } } } },
      source: { a: { b: { c: { e: 2 }, f: 3 }, g: 4 }, h: 5 },
    });

    expect(result).to.deep.equal({
      a: { b: { c: { d: 1, e: 2 }, f: 3 }, g: 4 },
      h: 5,
    });
  });

  it("should preserve null values in target", () => {
    const result = defaultsDeep({
      target: { a: null },
      source: { a: 1 },
    });

    expect(result).to.deep.equal({ a: null });
  });

  it("should preserve falsy values (0, '', false) in target", () => {
    const result = defaultsDeep({
      target: { a: 0, b: "", c: false },
      source: { a: 1, b: "fallback", c: true },
    });

    expect(result).to.deep.equal({ a: 0, b: "", c: false });
  });

  it("should replace undefined values with source values", () => {
    const result = defaultsDeep({
      target: { a: undefined, b: 2 },
      source: { a: { nested: true }, b: 99 },
    });

    expect(result).to.deep.equal({ a: { nested: true }, b: 2 });
  });

  it("should preserve target arrays (not merge with source arrays)", () => {
    const result = defaultsDeep({
      target: { tags: [1, 2] },
      source: { tags: [3, 4, 5] },
    });

    expect(result).to.deep.equal({ tags: [1, 2] });
  });

  it("should use source array when target key is undefined", () => {
    const result = defaultsDeep({
      target: {},
      source: { tags: [1, 2, 3] },
    });

    expect(result).to.deep.equal({ tags: [1, 2, 3] });
  });

  it("should preserve primitive target when source has an object", () => {
    const result = defaultsDeep({
      target: { a: "flat" },
      source: { a: { nested: true } },
    });

    expect(result).to.deep.equal({ a: "flat" });
  });

  it("should preserve object target when source has a primitive", () => {
    const result = defaultsDeep({
      target: { a: { b: 1 } },
      source: { a: "flat" },
    });

    expect(result).to.deep.equal({ a: { b: 1 } });
  });

  it("should handle empty target", () => {
    const result = defaultsDeep({
      target: {},
      source: { a: 1, b: { c: 2 } },
    });

    expect(result).to.deep.equal({ a: 1, b: { c: 2 } });
  });

  it("should handle empty source", () => {
    const result = defaultsDeep({
      target: { a: 1, b: { c: 2 } },
      source: {},
    });

    expect(result).to.deep.equal({ a: 1, b: { c: 2 } });
  });

  it("should handle both empty objects", () => {
    const result = defaultsDeep({ target: {}, source: {} });

    expect(result).to.deep.equal({});
  });

  it("should not mutate the inputs", () => {
    const target = { db: { port: 5432 } };
    const source = { db: { port: 3306, host: "localhost" } };
    const result = defaultsDeep({ target, source });

    expect(result).to.not.equal(target);
    expect(result.db).to.not.equal(target.db);
    expect(target).to.deep.equal({ db: { port: 5432 } });
    expect(source).to.deep.equal({ db: { port: 3306, host: "localhost" } });
  });

  it("should not mutate nested source objects when copied", () => {
    const source = { a: { b: { c: 1 } } };
    const result = defaultsDeep({ target: {}, source });

    // nested source objects are copied by reference when target lacks the key
    expect(result.a).to.equal(source.a);
  });

  it("should throw if target is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaultsDeep({ target: "string", source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if target is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaultsDeep({ target: null, source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if target is an array", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaultsDeep({ target: [1, 2], source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw if source is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaultsDeep({ target: {}, source: 42 })).to.throw(
      "The 'source' parameter is not an object",
    );
  });

  it("should throw if source is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => defaultsDeep({ target: {}, source: null })).to.throw(
      "The 'source' parameter is not an object",
    );
  });
});
