import { expect } from "chai";
import { describe, it } from "mocha";
import { unique } from "./index.js";

describe("unique", () => {
  it("should remove duplicate primitives", () => {
    const result = unique({ array: [1, 2, 2, 3, 3, 3] });

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it("should return an empty array when given an empty array", () => {
    const result = unique({ array: [] });

    expect(result).to.deep.equal([]);
  });

  it("should return the same array when there are no duplicates", () => {
    const result = unique({ array: [1, 2, 3] });

    expect(result).to.deep.equal([1, 2, 3]);
  });

  it("should work with strings", () => {
    const result = unique({ array: ["a", "b", "a", "c", "b"] });

    expect(result).to.deep.equal(["a", "b", "c"]);
  });

  it("should deduplicate objects by key", () => {
    const result = unique({
      array: [{ id: 1 }, { id: 1 }, { id: 2 }],
      key: "id",
    });

    expect(result).to.deep.equal([{ id: 1 }, { id: 2 }]);
  });

  it("should keep the first occurrence when deduplicating by key", () => {
    const result = unique({
      array: [
        { id: 1, name: "first" },
        { id: 1, name: "second" },
      ],
      key: "id",
    });

    expect(result).to.deep.equal([{ id: 1, name: "first" }]);
  });

  it("should return the same array when no duplicate keys exist", () => {
    const result = unique({
      array: [{ id: 1 }, { id: 2 }, { id: 3 }],
      key: "id",
    });

    expect(result).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("should throw an error if the array is not an array", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => unique({ array: "not an array" })).to.throw(
      "The 'array' parameter is not an array",
    );
  });
});
