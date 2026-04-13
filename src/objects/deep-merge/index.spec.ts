import { expect } from "chai";
import { describe, it } from "mocha";
import { deepMerge } from "./index.js";

describe("deepMerge", () => {
  it("should shallow merge non-overlapping keys", () => {
    const result = deepMerge({
      target: { a: 1 },
      source: { b: 2 },
    });

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should override primitive values with source", () => {
    const result = deepMerge({
      target: { a: 1, b: "hello" },
      source: { a: 2, b: "world" },
    });

    expect(result).to.deep.equal({ a: 2, b: "world" });
  });

  it("should recursively merge nested objects", () => {
    const result = deepMerge({
      target: { user: { name: "Ana", settings: { theme: "dark" } } },
      source: { user: { settings: { lang: "pt" } } },
    });

    expect(result).to.deep.equal({
      user: { name: "Ana", settings: { theme: "dark", lang: "pt" } },
    });
  });

  it("should merge deeply nested objects (3+ levels)", () => {
    const result = deepMerge({
      target: { a: { b: { c: { d: 1, e: 2 } } } },
      source: { a: { b: { c: { e: 3, f: 4 } } } },
    });

    expect(result).to.deep.equal({
      a: { b: { c: { d: 1, e: 3, f: 4 } } },
    });
  });

  it("should replace arrays instead of merging them", () => {
    const result = deepMerge({
      target: { tags: [1, 2, 3] },
      source: { tags: [4, 5] },
    });

    expect(result).to.deep.equal({ tags: [4, 5] });
  });

  it("should handle source overriding object with primitive", () => {
    const result = deepMerge({
      target: { a: { nested: true } },
      source: { a: "flat" },
    });

    expect(result).to.deep.equal({ a: "flat" });
  });

  it("should handle source overriding primitive with object", () => {
    const result = deepMerge({
      target: { a: "flat" },
      source: { a: { nested: true } },
    });

    expect(result).to.deep.equal({ a: { nested: true } });
  });

  it("should handle null values in source", () => {
    const result = deepMerge({
      target: { a: { b: 1 } },
      source: { a: null },
    });

    expect(result).to.deep.equal({ a: null });
  });

  it("should handle undefined values in source", () => {
    const result = deepMerge({
      target: { a: 1 },
      source: { a: undefined },
    });

    expect(result).to.deep.equal({ a: undefined });
  });

  it("should return a new object, not mutate the originals", () => {
    const target = { user: { name: "Ana", settings: { theme: "dark" } } };
    const source = { user: { settings: { lang: "pt" } } };
    const result = deepMerge({ target, source });

    expect(result).to.not.equal(target);
    expect(result).to.not.equal(source);
    expect(target).to.deep.equal({
      user: { name: "Ana", settings: { theme: "dark" } },
    });
    expect(source).to.deep.equal({ user: { settings: { lang: "pt" } } });
  });

  it("should handle empty target", () => {
    const result = deepMerge({
      target: {},
      source: { a: 1, b: { c: 2 } },
    });

    expect(result).to.deep.equal({ a: 1, b: { c: 2 } });
  });

  it("should handle empty source", () => {
    const result = deepMerge({
      target: { a: 1, b: { c: 2 } },
      source: {},
    });

    expect(result).to.deep.equal({ a: 1, b: { c: 2 } });
  });

  it("should handle both empty objects", () => {
    const result = deepMerge({ target: {}, source: {} });

    expect(result).to.deep.equal({});
  });

  it("should throw an error if target is not an object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => deepMerge({ target: "string", source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw an error if target is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => deepMerge({ target: null, source: {} })).to.throw(
      "The 'target' parameter is not an object",
    );
  });

  it("should throw an error if source is not an object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => deepMerge({ target: {}, source: 42 })).to.throw(
      "The 'source' parameter is not an object",
    );
  });

  it("should throw an error if source is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => deepMerge({ target: {}, source: null })).to.throw(
      "The 'source' parameter is not an object",
    );
  });
});
