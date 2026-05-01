import { expect } from "chai";
import { describe, it } from "mocha";
import { zip } from "./index.js";

describe("zip", () => {
  it("should combine two arrays of the same length", () => {
    const result = zip({
      arrays: [
        ["a", "b", "c"],
        [1, 2, 3],
      ],
    });

    expect(result).to.deep.equal([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should combine three arrays of the same length", () => {
    const result = zip({
      arrays: [
        ["a", "b"],
        [1, 2],
        [true, false],
      ],
    });

    expect(result).to.deep.equal([
      ["a", 1, true],
      ["b", 2, false],
    ]);
  });

  it("should pad with undefined when arrays have different lengths (default fill)", () => {
    const result = zip({
      arrays: [
        ["a", "b", "c"],
        [1, 2],
      ],
    });

    expect(result).to.deep.equal([
      ["a", 1],
      ["b", 2],
      ["c", undefined],
    ]);
  });

  it("should truncate to the shortest array when strategy is 'truncate'", () => {
    const result = zip({
      arrays: [
        ["a", "b", "c"],
        [1, 2],
      ],
      strategy: "truncate",
    });

    expect(result).to.deep.equal([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("should return an empty array when arrays is empty", () => {
    const result = zip({ arrays: [] });

    expect(result).to.deep.equal([]);
  });

  it("should handle a single inner array", () => {
    const result = zip({ arrays: [[1, 2, 3]] });

    expect(result).to.deep.equal([[1], [2], [3]]);
  });

  it("should handle inner empty arrays with fill", () => {
    const result = zip({ arrays: [["a", "b"], []] });

    expect(result).to.deep.equal([
      ["a", undefined],
      ["b", undefined],
    ]);
  });

  it("should return [] when truncate meets an empty inner array", () => {
    const result = zip({
      arrays: [["a", "b"], []],
      strategy: "truncate",
    });

    expect(result).to.deep.equal([]);
  });

  it("should throw an error if arrays is not an array", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => zip({ arrays: "not an array" })).to.throw(
      "The 'arrays' parameter is not an array",
    );
  });

  it("should throw an error if any inner element is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      zip({ arrays: [[1, 2], "nope"] }),
    ).to.throw("All elements of 'arrays' must be arrays");
  });

  it("should throw an error if strategy is invalid", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      zip({ arrays: [[1, 2]], strategy: "wat" }),
    ).to.throw("The 'strategy' parameter must be 'fill' or 'truncate'");
  });
});
