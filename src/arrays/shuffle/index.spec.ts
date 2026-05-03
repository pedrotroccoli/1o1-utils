import { expect } from "chai";
import { describe, it } from "mocha";
import { shuffle } from "./index.js";

describe("shuffle", () => {
  it("should return an array of the same length", () => {
    const result = shuffle({ array: [1, 2, 3, 4, 5] });

    expect(result).to.have.lengthOf(5);
  });

  it("should not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];

    shuffle({ array: input });

    expect(input).to.deep.equal(snapshot);
  });

  it("should return a new array reference", () => {
    const input = [1, 2, 3];
    const result = shuffle({ array: input });

    expect(result).to.not.equal(input);
  });

  it("should return an empty array when given an empty array", () => {
    const result = shuffle({ array: [] });

    expect(result).to.deep.equal([]);
  });

  it("should return the same single element when given a single-element array", () => {
    const result = shuffle({ array: [42] });

    expect(result).to.deep.equal([42]);
  });

  it("should preserve all elements (only reorder)", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle({ array: input });

    expect([...result].sort((a, b) => a - b)).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it("should produce a deterministic order with an injected random source", () => {
    const result = shuffle({
      array: [1, 2, 3, 4, 5],
      random: () => 0,
    });

    expect(result).to.deep.equal([2, 3, 4, 5, 1]);
  });

  it("should leave order unchanged when random always returns the maximum (j === i)", () => {
    const result = shuffle({
      array: [1, 2, 3, 4, 5],
      random: () => 0.999_999_999,
    });

    expect(result).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it("should reach all 6 permutations of [1,2,3] across many runs", () => {
    const seen = new Set<string>();

    for (let i = 0; i < 500; i++) {
      seen.add(shuffle({ array: [1, 2, 3] }).join(","));
    }

    expect(seen.size).to.equal(6);
  });

  it("should throw an error if the array is not an array", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => shuffle({ array: "not an array" })).to.throw(
      "The 'array' parameter is not an array",
    );
  });
});
