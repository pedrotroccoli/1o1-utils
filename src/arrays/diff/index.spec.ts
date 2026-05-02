import { expect } from "chai";
import { describe, it } from "mocha";
import { diff } from "./index.js";

describe("diff", () => {
  it("should return elements present in the first array but not in the second", () => {
    const result = diff({ array: [1, 2, 3, 4], values: [2, 4] });

    expect(result).to.deep.equal([1, 3]);
  });

  it("should work with strings", () => {
    const result = diff({ array: ["a", "b", "c", "d"], values: ["b", "d"] });

    expect(result).to.deep.equal(["a", "c"]);
  });

  it("should return an empty array when the source array is empty", () => {
    const result = diff({ array: [], values: [1, 2] });

    expect(result).to.deep.equal([]);
  });

  it("should return a copy of the source array when values is empty", () => {
    const source = [1, 2, 3];
    const result = diff({ array: source, values: [] });

    expect(result).to.deep.equal([1, 2, 3]);
    expect(result).to.not.equal(source);
  });

  it("should return an empty array when all elements are excluded", () => {
    const result = diff({ array: [1, 2, 3], values: [1, 2, 3] });

    expect(result).to.deep.equal([]);
  });

  it("should return the source array when there is no overlap", () => {
    const result = diff({ array: [1, 2, 3], values: [4, 5, 6] });

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it("should preserve duplicates that are not in values", () => {
    const result = diff({ array: [1, 1, 2, 2, 3], values: [2] });

    expect(result).to.deep.equal([1, 1, 3]);
  });

  it("should preserve order of the source array", () => {
    const result = diff({ array: [3, 1, 4, 1, 5, 9, 2, 6], values: [1, 5] });

    expect(result).to.deep.equal([3, 4, 9, 2, 6]);
  });

  it("should support iteratee for objects", () => {
    const result = diff({
      array: [{ id: 1 }, { id: 2 }, { id: 3 }],
      values: [{ id: 2 }],
      iteratee: (item) => item.id,
    });

    expect(result).to.deep.equal([{ id: 1 }, { id: 3 }]);
  });

  it("should keep all matching duplicates filtered when using iteratee", () => {
    const result = diff({
      array: [
        { id: 1, name: "a" },
        { id: 1, name: "b" },
        { id: 2, name: "c" },
      ],
      values: [{ id: 1 }],
      iteratee: (item) => item.id,
    });

    expect(result).to.deep.equal([{ id: 2, name: "c" }]);
  });

  it("should not mutate the inputs", () => {
    const array = [1, 2, 3];
    const values = [2];
    diff({ array, values });

    expect(array).to.deep.equal([1, 2, 3]);
    expect(values).to.deep.equal([2]);
  });

  it("should treat NaN as equal to NaN (SameValueZero) without iteratee", () => {
    const result = diff({
      array: [Number.NaN, 1, 2, Number.NaN, 3],
      values: [Number.NaN],
    });

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it("should treat NaN as equal to NaN when iteratee returns NaN", () => {
    const result = diff({
      array: [{ x: Number.NaN }, { x: 1 }, { x: 2 }],
      values: [{ x: Number.NaN }],
      iteratee: (item) => item.x,
    });

    expect(result).to.deep.equal([{ x: 1 }, { x: 2 }]);
  });

  it("should propagate errors thrown by iteratee", () => {
    expect(() =>
      diff({
        array: [1, 2, 3],
        values: [1],
        iteratee: () => {
          throw new Error("boom");
        },
      }),
    ).to.throw("boom");
  });

  it("should throw an error if array is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      diff({ array: "not an array", values: [] }),
    ).to.throw("The 'array' parameter is not an array");
  });

  it("should throw an error if values is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      diff({ array: [], values: "not an array" }),
    ).to.throw("The 'values' parameter is not an array");
  });
});
