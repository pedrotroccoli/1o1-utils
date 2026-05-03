import { expect } from "chai";
import { describe, it } from "mocha";
import { replace } from "./index.js";

describe("replace", () => {
  it("should replace the first matching item with a static value by default", () => {
    const users = [
      { id: 1, name: "Ana" },
      { id: 2, name: "Bob" },
    ];
    expect(
      replace({
        array: users,
        predicate: (u) => u.id === 2,
        value: { id: 2, name: "Bobby" },
      }),
    ).to.deep.equal([
      { id: 1, name: "Ana" },
      { id: 2, name: "Bobby" },
    ]);
  });

  it("should replace only the first match when multiple match and `all` is false", () => {
    expect(
      replace({
        array: [1, 2, 3, 2, 4],
        predicate: (n) => n === 2,
        value: 99,
      }),
    ).to.deep.equal([1, 99, 3, 2, 4]);
  });

  it("should replace every match when `all` is true", () => {
    expect(
      replace({
        array: [1, 2, 3, 2, 4],
        predicate: (n) => n === 2,
        value: 99,
        all: true,
      }),
    ).to.deep.equal([1, 99, 3, 99, 4]);
  });

  it("should accept an updater function and pass (item, index)", () => {
    const seen: Array<[unknown, number]> = [];
    const result = replace({
      array: [10, 20, 30, 20],
      predicate: (n) => n === 20,
      value: (item, index) => {
        seen.push([item, index]);
        return item + index;
      },
      all: true,
    });
    expect(result).to.deep.equal([10, 21, 30, 23]);
    expect(seen).to.deep.equal([
      [20, 1],
      [20, 3],
    ]);
  });

  it("should pass index to predicate", () => {
    expect(
      replace({
        array: ["a", "b", "c", "d"],
        predicate: (_, i) => i === 2,
        value: "X",
      }),
    ).to.deep.equal(["a", "b", "X", "d"]);
  });

  it("should return a shallow copy when no item matches", () => {
    const input = [1, 2, 3];
    const out = replace({
      array: input,
      predicate: () => false,
      value: 99,
    });
    expect(out).to.deep.equal([1, 2, 3]);
    expect(out).to.not.equal(input);
  });

  it("should return an empty array for empty input", () => {
    expect(
      replace({ array: [], predicate: () => true, value: 1 }),
    ).to.deep.equal([]);
  });

  it("should not mutate the input array", () => {
    const input = [1, 2, 3];
    const snapshot = [...input];
    replace({
      array: input,
      predicate: (n) => n === 2,
      value: 99,
      all: true,
    });
    expect(input).to.deep.equal(snapshot);
  });

  it("should accept falsy static values like 0, '', null, false", () => {
    expect(
      replace({ array: [1, 2, 3], predicate: (n) => n === 2, value: 0 }),
    ).to.deep.equal([1, 0, 3]);
    expect(
      replace({ array: [1, 2, 3], predicate: (n) => n === 2, value: null }),
    ).to.deep.equal([1, null, 3]);
  });

  it("should throw an error if array is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      replace({ array: "abc", predicate: () => true, value: 1 }),
    ).to.throw("The 'array' parameter is not an array");
  });

  it("should throw an error if array is null", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      replace({ array: null, predicate: () => true, value: 1 }),
    ).to.throw("The 'array' parameter is not an array");
  });

  it("should throw an error if predicate is not a function", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      replace({ array: [1, 2, 3], predicate: "nope", value: 1 }),
    ).to.throw("The 'predicate' parameter must be a function");
  });

  it("should throw an error if predicate is undefined", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      replace({ array: [1, 2, 3], value: 1 }),
    ).to.throw("The 'predicate' parameter must be a function");
  });

  it("should throw an error if value is undefined", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      replace({ array: [1, 2, 3], predicate: () => true }),
    ).to.throw("The 'value' parameter is required");
  });
});
