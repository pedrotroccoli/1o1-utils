import { expect } from "chai";
import { describe, it } from "mocha";
import { get } from "./index.js";

describe("get", () => {
  it("should read a top-level value", () => {
    const result = get({ obj: { a: 1, b: 2 }, path: "a" });
    expect(result).to.equal(1);
  });

  it("should read a nested value via dot notation", () => {
    const result = get({
      obj: { address: { city: "São Paulo" } },
      path: "address.city",
    });
    expect(result).to.equal("São Paulo");
  });

  it("should read a deeply nested value", () => {
    const result = get({
      obj: { a: { b: { c: { d: 42 } } } },
      path: "a.b.c.d",
    });
    expect(result).to.equal(42);
  });

  it("should return undefined when the path does not exist", () => {
    const result = get({ obj: { a: 1 }, path: "b" });
    expect(result).to.equal(undefined);
  });

  it("should return defaultValue when the path does not exist", () => {
    const result = get({ obj: { a: 1 }, path: "b", defaultValue: "BR" });
    expect(result).to.equal("BR");
  });

  it("should return defaultValue when an intermediate segment is missing", () => {
    const result = get({
      obj: { a: { b: 1 } },
      path: "a.x.y",
      defaultValue: 0,
    });
    expect(result).to.equal(0);
  });

  it("should return defaultValue when an intermediate value is a primitive", () => {
    const result = get({
      obj: { a: "not an object" },
      path: "a.b",
      defaultValue: "fallback",
    });
    expect(result).to.equal("fallback");
  });

  it("should preserve defaultValue of null", () => {
    const result = get({ obj: { a: 1 }, path: "missing", defaultValue: null });
    expect(result).to.equal(null);
  });

  it("should return defaultValue when value at path is undefined", () => {
    const result = get({ obj: { a: undefined }, path: "a", defaultValue: "X" });
    expect(result).to.equal("X");
  });

  it("should not confuse value null with missing", () => {
    const result = get({ obj: { a: null }, path: "a", defaultValue: "X" });
    expect(result).to.equal(null);
  });

  it("should return defaultValue when obj is null", () => {
    // @ts-expect-error - testing invalid input
    const result = get({ obj: null, path: "a", defaultValue: "X" });
    expect(result).to.equal("X");
  });

  it("should return defaultValue when obj is a primitive", () => {
    // @ts-expect-error - testing invalid input
    const result = get({ obj: "hello", path: "a", defaultValue: "X" });
    expect(result).to.equal("X");
  });

  it("should return defaultValue when path is empty", () => {
    const result = get({ obj: { a: 1 }, path: "", defaultValue: "X" });
    expect(result).to.equal("X");
  });

  it("should return defaultValue when path is not a string", () => {
    // @ts-expect-error - testing invalid input
    const result = get({ obj: { a: 1 }, path: 123, defaultValue: "X" });
    expect(result).to.equal("X");
  });

  it("should read from arrays using numeric segments", () => {
    const result = get({
      obj: { items: [{ name: "a" }, { name: "b" }] },
      path: "items.1.name",
    });
    expect(result).to.equal("b");
  });
});
