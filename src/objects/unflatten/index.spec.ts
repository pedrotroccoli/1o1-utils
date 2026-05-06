import { expect } from "chai";
import { describe, it } from "mocha";
import { unflatten } from "./index.js";

describe("unflatten", () => {
  it("should rebuild a nested object from dot-notation keys", () => {
    const result = unflatten({
      obj: { "a.b": 1, "a.c.d": 2, e: 3 },
    });
    expect(result).to.deep.equal({ a: { b: 1, c: { d: 2 } }, e: 3 });
  });

  it("should be the inverse of flattening for plain values", () => {
    const result = unflatten({
      obj: { "user.name": "Ana", "user.age": 30, id: 1 },
    });
    expect(result).to.deep.equal({ user: { name: "Ana", age: 30 }, id: 1 });
  });

  it("should return an empty object for empty input", () => {
    const result = unflatten({ obj: {} });
    expect(result).to.deep.equal({});
  });

  it("should preserve top-level keys without dots", () => {
    const result = unflatten({ obj: { a: 1, b: 2 } });
    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("should keep numeric segments as object keys by default", () => {
    const result = unflatten({ obj: { "a.0": "x", "a.1": "y" } });
    expect(result).to.deep.equal({ a: { "0": "x", "1": "y" } });
  });

  it("should reconstruct arrays when arrays = true", () => {
    const result = unflatten({
      obj: { "a.0": "x", "a.1": "y" },
      arrays: true,
    });
    expect(result).to.deep.equal({ a: ["x", "y"] });
  });

  it("should reconstruct nested arrays when arrays = true", () => {
    const result = unflatten({
      obj: { "users.0.name": "Ana", "users.1.name": "Bob" },
      arrays: true,
    });
    expect(result).to.deep.equal({
      users: [{ name: "Ana" }, { name: "Bob" }],
    });
  });

  it("should handle deep nesting", () => {
    const result = unflatten({ obj: { "a.b.c.d.e.f": 1 } });
    expect(result).to.deep.equal({ a: { b: { c: { d: { e: { f: 1 } } } } } });
  });

  it("should preserve null values at leaves", () => {
    const result = unflatten({ obj: { "a.b": null } });
    expect(result).to.deep.equal({ a: { b: null } });
  });

  it("should preserve undefined values at leaves", () => {
    const result = unflatten({ obj: { "a.b": undefined } });
    expect(result).to.deep.equal({ a: { b: undefined } });
  });

  it("should preserve arrays as leaf values", () => {
    const result = unflatten({ obj: { "a.b": [1, 2, 3] } });
    expect(result).to.deep.equal({ a: { b: [1, 2, 3] } });
  });

  it("should give last write priority for conflicting keys (scalar then nested)", () => {
    const result = unflatten({ obj: { a: 1, "a.b": 2 } });
    expect(result).to.deep.equal({ a: { b: 2 } });
  });

  it("should give last write priority for conflicting keys (nested then scalar)", () => {
    const result = unflatten({ obj: { "a.b": 2, a: 1 } });
    expect(result).to.deep.equal({ a: 1 });
  });

  it("should ignore unsafe key segments", () => {
    const result = unflatten({
      obj: {
        "__proto__.polluted": true,
        "a.constructor.x": 1,
        "a.b": 2,
      },
    });
    expect(result).to.deep.equal({ a: { b: 2 } });
    expect(({} as Record<string, unknown>).polluted).to.equal(undefined);
  });

  it("should ignore top-level unsafe key", () => {
    const result = unflatten({ obj: { __proto__: { polluted: true } } });
    expect(result).to.deep.equal({});
    expect(({} as Record<string, unknown>).polluted).to.equal(undefined);
  });

  it("should not mutate the input object", () => {
    const input = { "a.b": 1, c: 2 };
    const snapshot = { ...input };
    unflatten({ obj: input });
    expect(input).to.deep.equal(snapshot);
  });

  it("should return a new object reference", () => {
    const input = { "a.b": 1 };
    const result = unflatten({ obj: input });
    expect(result).to.not.equal(input);
  });

  it("should merge multiple keys under the same parent", () => {
    const result = unflatten({
      obj: { "user.name": "Ana", "user.email": "ana@test.com" },
    });
    expect(result).to.deep.equal({
      user: { name: "Ana", email: "ana@test.com" },
    });
  });

  it("should throw if obj is not an object", () => {
    expect(() =>
      unflatten({ obj: null as unknown as Record<string, unknown> }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw if obj is an array", () => {
    expect(() =>
      unflatten({ obj: [] as unknown as Record<string, unknown> }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw if obj is a primitive", () => {
    expect(() =>
      unflatten({ obj: "abc" as unknown as Record<string, unknown> }),
    ).to.throw("The 'obj' parameter is not an object");
  });
});
