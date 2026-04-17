import { expect } from "chai";
import { describe, it } from "mocha";
import { set } from "./index.js";

describe("set", () => {
  it("should set a top-level value", () => {
    const result = set({ obj: { a: 1 }, path: "a", value: 2 });
    expect(result).to.deep.equal({ a: 2 });
  });

  it("should set a new top-level key", () => {
    const result = set({ obj: { a: 1 }, path: "b", value: 2 });
    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should set a nested value", () => {
    const result = set({
      obj: { address: { city: "SP", zip: "01000" } },
      path: "address.city",
      value: "Rio",
    });
    expect(result).to.deep.equal({ address: { city: "Rio", zip: "01000" } });
  });

  it("should create missing intermediate objects", () => {
    const result = set({ obj: {}, path: "a.b.c", value: 1 });
    expect(result).to.deep.equal({ a: { b: { c: 1 } } });
  });

  it("should not mutate the input object", () => {
    const input = { address: { city: "SP" } };
    const snapshot = { address: { city: "SP" } };
    set({ obj: input, path: "address.city", value: "Rio" });
    expect(input).to.deep.equal(snapshot);
  });

  it("should not mutate nested objects not on the path", () => {
    const sibling = { untouched: true };
    const input = { a: sibling, b: { c: 1 } };
    const result = set({ obj: input, path: "b.c", value: 2 });
    expect(result.a).to.equal(sibling);
  });

  it("should clone nodes on the path (new reference)", () => {
    const input = { a: { b: 1 } };
    const result = set({ obj: input, path: "a.b", value: 2 });
    expect(result).to.not.equal(input);
    expect(result.a).to.not.equal(input.a);
  });

  it("should create arrays for numeric segments by default", () => {
    const result = set({ obj: {}, path: "items.0.name", value: "x" });
    expect(result).to.deep.equal({ items: [{ name: "x" }] });
    expect(Array.isArray((result as { items: unknown }).items)).to.equal(true);
  });

  it("should create objects for numeric segments when objectify is true", () => {
    const result = set({
      obj: {},
      path: "items.0.name",
      value: "x",
      objectify: true,
    });
    expect(result).to.deep.equal({ items: { "0": { name: "x" } } });
    expect(Array.isArray((result as { items: unknown }).items)).to.equal(false);
  });

  it("should preserve existing arrays when writing via numeric index", () => {
    const input = { items: [{ name: "a" }, { name: "b" }] };
    const result = set({ obj: input, path: "items.1.name", value: "B" });
    expect(result).to.deep.equal({
      items: [{ name: "a" }, { name: "B" }],
    });
    expect(Array.isArray((result as { items: unknown }).items)).to.equal(true);
  });

  it("should overwrite when an intermediate value is a primitive", () => {
    const result = set({
      obj: { a: "primitive" },
      path: "a.b",
      value: 1,
    });
    expect(result).to.deep.equal({ a: { b: 1 } });
  });

  it("should overwrite when an intermediate value is null", () => {
    const result = set({ obj: { a: null }, path: "a.b", value: 1 });
    expect(result).to.deep.equal({ a: { b: 1 } });
  });

  it("should set a deep path", () => {
    const result = set({
      obj: {},
      path: "a.b.c.d.e",
      value: 42,
    });
    expect(result).to.deep.equal({ a: { b: { c: { d: { e: 42 } } } } });
  });

  it("should throw when obj is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => set({ obj: null, path: "a", value: 1 })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw when obj is a primitive", () => {
    // @ts-expect-error - testing invalid input
    expect(() => set({ obj: "hello", path: "a", value: 1 })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw when path is not a string", () => {
    // @ts-expect-error - testing invalid input
    expect(() => set({ obj: { a: 1 }, path: 123, value: 1 })).to.throw(
      "The 'path' parameter is not a string",
    );
  });

  it("should throw when path is empty", () => {
    expect(() => set({ obj: { a: 1 }, path: "", value: 1 })).to.throw(
      "The 'path' parameter is an empty string",
    );
  });
});
