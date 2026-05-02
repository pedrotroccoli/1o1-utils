import { expect } from "chai";
import { describe, it } from "mocha";
import { mapValues } from "./index.js";

describe("mapValues", () => {
  it("should transform values via the iteratee", () => {
    const result = mapValues({
      obj: { a: 1, b: 2 },
      iteratee: (value) => value * 10,
    });

    expect(result).to.deep.equal({ a: 10, b: 20 });
  });

  it("should pass (value, key, obj) to the iteratee", () => {
    const calls: Array<[unknown, string, Record<string, unknown>]> = [];
    const obj = { a: 1, b: 2 };

    mapValues({
      obj,
      iteratee: (value, key, original) => {
        calls.push([value, key, original]);
        return value;
      },
    });

    expect(calls).to.deep.equal([
      [1, "a", obj],
      [2, "b", obj],
    ]);
  });

  it("should support changing the value type", () => {
    const result = mapValues({
      obj: { a: 1, b: 2 },
      iteratee: (value) => `n=${value}`,
    });

    expect(result).to.deep.equal({ a: "n=1", b: "n=2" });
  });

  it("should preserve key order", () => {
    const result = mapValues({
      obj: { z: 1, a: 2, m: 3 },
      iteratee: (value) => value * 2,
    });

    expect(Object.keys(result)).to.deep.equal(["z", "a", "m"]);
  });

  it("should return an empty object for an empty input", () => {
    const result = mapValues({
      obj: {} as Record<string, number>,
      iteratee: (v) => v,
    });

    expect(result).to.deep.equal({});
  });

  it("should not mutate the input", () => {
    const obj = { a: 1, b: 2 };
    const result = mapValues({
      obj,
      iteratee: (v) => v + 1,
    });

    expect(result).to.not.equal(obj);
    expect(obj).to.deep.equal({ a: 1, b: 2 });
  });

  it("should throw if obj is not a plain object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => mapValues({ obj: "string", iteratee: (v) => v })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw if obj is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => mapValues({ obj: null, iteratee: (v) => v })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw if obj is an array", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      mapValues({ obj: [1, 2, 3], iteratee: (v) => v }),
    ).to.throw("The 'obj' parameter is not an object");
  });

  it("should throw if iteratee is not a function", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      mapValues({ obj: { a: 1 }, iteratee: 42 }),
    ).to.throw("The 'iteratee' parameter is not a function");
  });
});
