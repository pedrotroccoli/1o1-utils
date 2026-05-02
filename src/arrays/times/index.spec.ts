import { expect } from "chai";
import { describe, it } from "mocha";
import { times } from "./index.js";

describe("times", () => {
  it("should return an array of mapped indices", () => {
    expect(times({ count: 3, fn: (i) => i * 2 })).to.deep.equal([0, 2, 4]);
  });

  it("should pass the current index to fn", () => {
    const seen: number[] = [];
    times({
      count: 4,
      fn: (i) => {
        seen.push(i);
        return i;
      },
    });
    expect(seen).to.deep.equal([0, 1, 2, 3]);
  });

  it("should return an empty array when count is 0", () => {
    expect(times({ count: 0, fn: (i) => i })).to.deep.equal([]);
  });

  it("should not invoke fn when count is 0", () => {
    let calls = 0;
    times({
      count: 0,
      fn: () => {
        calls++;
        return null;
      },
    });
    expect(calls).to.equal(0);
  });

  it("should support arbitrary return types", () => {
    expect(times({ count: 3, fn: (i) => `item-${i}` })).to.deep.equal([
      "item-0",
      "item-1",
      "item-2",
    ]);

    expect(times({ count: 2, fn: (i) => ({ id: i }) })).to.deep.equal([
      { id: 0 },
      { id: 1 },
    ]);
  });

  it("should produce a result array of the requested length", () => {
    expect(times({ count: 100, fn: () => 0 })).to.have.length(100);
  });

  it("should throw if count is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => times({ count: "3", fn: (i) => i })).to.throw(
      "The 'count' parameter must be a number",
    );
  });

  it("should throw if count is NaN", () => {
    expect(() => times({ count: Number.NaN, fn: (i) => i })).to.throw(
      "The 'count' parameter must be a number",
    );
  });

  it("should throw if count is not an integer", () => {
    expect(() => times({ count: 3.5, fn: (i) => i })).to.throw(
      "The 'count' parameter must be an integer",
    );
  });

  it("should throw if count is Infinity", () => {
    expect(() =>
      times({ count: Number.POSITIVE_INFINITY, fn: (i) => i }),
    ).to.throw("The 'count' parameter must be an integer");
  });

  it("should throw if count is negative", () => {
    expect(() => times({ count: -1, fn: (i) => i })).to.throw(
      "The 'count' parameter must be non-negative",
    );
  });

  it("should throw if fn is not a function", () => {
    // @ts-expect-error - testing invalid input
    expect(() => times({ count: 3, fn: null })).to.throw(
      "The 'fn' parameter must be a function",
    );
  });

  it("should throw if fn is undefined", () => {
    // @ts-expect-error - testing invalid input
    expect(() => times({ count: 3, fn: undefined })).to.throw(
      "The 'fn' parameter must be a function",
    );
  });
});
