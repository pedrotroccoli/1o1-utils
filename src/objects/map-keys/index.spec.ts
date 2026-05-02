import { expect } from "chai";
import { describe, it } from "mocha";
import { mapKeys } from "./index.js";

describe("mapKeys", () => {
  it("should transform keys via the iteratee", () => {
    const result = mapKeys({
      obj: { a: 1, b: 2 },
      iteratee: (_value, key) => key.toUpperCase(),
    });

    expect(result).to.deep.equal({ A: 1, B: 2 });
  });

  it("should pass (value, key, obj) to the iteratee", () => {
    const calls: Array<[unknown, string, Record<string, unknown>]> = [];
    const obj = { a: 1, b: 2 };

    mapKeys({
      obj,
      iteratee: (value, key, original) => {
        calls.push([value, key, original]);
        return key;
      },
    });

    expect(calls).to.deep.equal([
      [1, "a", obj],
      [2, "b", obj],
    ]);
  });

  it("should coerce non-string iteratee return to string", () => {
    const result = mapKeys({
      obj: { a: 1, b: 2 },
      iteratee: (value) => value as number,
    });

    expect(result).to.deep.equal({ "1": 1, "2": 2 });
  });

  it("should let last write win on key collisions", () => {
    const result = mapKeys({
      obj: { a: 1, b: 2, c: 3 },
      iteratee: () => "x",
    });

    expect(result).to.deep.equal({ x: 3 });
  });

  it("should skip prototype-pollution keys", () => {
    const result = mapKeys({
      obj: { a: 1, b: 2, c: 3 },
      iteratee: (_value, key) => {
        if (key === "a") return "__proto__";
        if (key === "b") return "constructor";
        if (key === "c") return "prototype";
        return key;
      },
    });

    expect(result).to.deep.equal({});
    expect(Object.getPrototypeOf(result)).to.equal(Object.prototype);
  });

  it("should return an empty object for an empty input", () => {
    const result = mapKeys({
      obj: {},
      iteratee: (_v, k) => k,
    });

    expect(result).to.deep.equal({});
  });

  it("should not mutate the input", () => {
    const obj = { a: 1, b: 2 };
    const result = mapKeys({
      obj,
      iteratee: (_v, k) => k.toUpperCase(),
    });

    expect(result).to.not.equal(obj);
    expect(obj).to.deep.equal({ a: 1, b: 2 });
  });

  it("should ignore inherited properties", () => {
    const proto = { inherited: "nope" };
    const obj = Object.create(proto) as Record<string, unknown>;
    obj.own = "yes";

    // isPlainObject rejects objects with non-Object constructor
    // so use a plain object literal that has its prototype mutated indirectly:
    const ok = { own: "yes" };
    const result = mapKeys({
      obj: ok,
      iteratee: (_v, k) => k.toUpperCase(),
    });

    expect(result).to.deep.equal({ OWN: "yes" });
  });

  it("should throw if obj is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => mapKeys({ obj: "string", iteratee: (_v, k) => k })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw if obj is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => mapKeys({ obj: null, iteratee: (_v, k) => k })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw if obj is an array", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      mapKeys({ obj: [1, 2, 3], iteratee: (_v, k) => k }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw if iteratee is not a function", () => {
    // @ts-expect-error - testing invalid input
    expect(() =>
      mapKeys({ obj: { a: 1 }, iteratee: "not a function" }),
    ).to.throw("The 'iteratee' parameter is not a function");
  });
});
