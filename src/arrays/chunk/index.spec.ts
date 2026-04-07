import { expect } from "chai";
import { describe, it } from "mocha";
import { chunk } from "./index.js";

describe("chunk", () => {
  it("should split an array into groups of the given size", () => {
    const result = chunk({ array: [1, 2, 3, 4, 5], size: 2 });

    expect(result).to.deep.equal([[1, 2], [3, 4], [5]]);
  });

  it("should return an empty array when given an empty array", () => {
    const result = chunk({ array: [], size: 2 });

    expect(result).to.deep.equal([]);
  });

  it("should split evenly when array length is a multiple of size", () => {
    const result = chunk({ array: [1, 2, 3, 4], size: 2 });

    expect(result).to.deep.equal([
      [1, 2],
      [3, 4],
    ]);
  });

  it("should return the whole array in one chunk when size is greater than array length", () => {
    const result = chunk({ array: [1, 2, 3], size: 10 });

    expect(result).to.deep.equal([[1, 2, 3]]);
  });

  it("should put each element in its own chunk when size is 1", () => {
    const result = chunk({ array: [1, 2, 3], size: 1 });

    expect(result).to.deep.equal([[1], [2], [3]]);
  });

  it("should throw an error if the array is not an array", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => chunk({ array: "not an array", size: 2 })).to.throw(
      "The 'array' parameter is not an array",
    );
  });

  it("should throw an error if size is zero", () => {
    expect(() => chunk({ array: [1, 2, 3], size: 0 })).to.throw(
      "The 'size' parameter must be a positive integer",
    );
  });

  it("should throw an error if size is negative", () => {
    expect(() => chunk({ array: [1, 2, 3], size: -1 })).to.throw(
      "The 'size' parameter must be a positive integer",
    );
  });

  it("should throw an error if size is not an integer", () => {
    expect(() => chunk({ array: [1, 2, 3], size: 2.5 })).to.throw(
      "The 'size' parameter must be a positive integer",
    );
  });
});
