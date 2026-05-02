import { expect } from "chai";
import { describe, it } from "mocha";
import { zip } from "../zip/index.js";
import { unzip } from "./index.js";

describe("unzip", () => {
  it("should split tuples back into separate arrays", () => {
    const result = unzip({
      array: [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
    });

    expect(result).to.deep.equal([
      ["a", "b", "c"],
      [1, 2, 3],
    ]);
  });

  it("should handle three-element tuples", () => {
    const result = unzip({
      array: [
        ["a", 1, true],
        ["b", 2, false],
      ],
    });

    expect(result).to.deep.equal([
      ["a", "b"],
      [1, 2],
      [true, false],
    ]);
  });

  it("should pad with undefined when tuples have different lengths (default fill)", () => {
    const result = unzip({
      array: [["a", 1], ["b"]],
    });

    expect(result).to.deep.equal([
      ["a", "b"],
      [1, undefined],
    ]);
  });

  it("should truncate to the shortest tuple when strategy is 'truncate'", () => {
    const result = unzip({
      array: [
        ["a", 1, true],
        ["b", 2],
      ],
      strategy: "truncate",
    });

    expect(result).to.deep.equal([
      ["a", "b"],
      [1, 2],
    ]);
  });

  it("should round-trip with zip", () => {
    const arrays = [
      ["a", "b", "c"],
      [1, 2, 3],
    ];
    const zipped = zip<string | number>({ arrays });
    const unzipped = unzip<string | number>({ array: zipped });

    expect(unzipped).to.deep.equal(arrays);
  });

  it("should return an empty array when array is empty", () => {
    const result = unzip({ array: [] });

    expect(result).to.deep.equal([]);
  });

  it("should throw an error if array is not an array", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => unzip({ array: "not an array" })).to.throw(
      "The 'array' parameter is not an array",
    );
  });

  it("should throw an error if any inner element is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      unzip({ array: [[1, 2], "nope"] }),
    ).to.throw("All elements of 'array' must be arrays");
  });

  it("should throw an error if strategy is invalid", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      unzip({ array: [[1, 2]], strategy: "wat" }),
    ).to.throw("The 'strategy' parameter must be 'fill' or 'truncate'");
  });
});
