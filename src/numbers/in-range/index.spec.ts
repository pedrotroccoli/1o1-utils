import { expect } from "chai";
import { describe, it } from "mocha";
import { inRange } from "./index.js";

describe("inRange", () => {
  it("should return true when value is inside the range", () => {
    expect(inRange({ value: 3, start: 1, end: 5 })).to.equal(true);
  });

  it("should return true at the start bound (inclusive)", () => {
    expect(inRange({ value: 1, start: 1, end: 5 })).to.equal(true);
  });

  it("should return false at the end bound (exclusive)", () => {
    expect(inRange({ value: 5, start: 1, end: 5 })).to.equal(false);
  });

  it("should handle negative ranges", () => {
    expect(inRange({ value: -1, start: -5, end: 5 })).to.equal(true);
    expect(inRange({ value: -5, start: -5, end: 0 })).to.equal(true);
    expect(inRange({ value: -6, start: -5, end: 0 })).to.equal(false);
  });

  it("should swap bounds when start is greater than end", () => {
    expect(inRange({ value: 3, start: 5, end: 1 })).to.equal(true);
    expect(inRange({ value: 1, start: 5, end: 1 })).to.equal(true);
    expect(inRange({ value: 5, start: 5, end: 1 })).to.equal(false);
  });

  it("should return false for a zero-width range", () => {
    expect(inRange({ value: 1, start: 1, end: 1 })).to.equal(false);
  });

  it("should handle floating-point values", () => {
    expect(inRange({ value: 1.5, start: 1, end: 2 })).to.equal(true);
    expect(inRange({ value: 2, start: 1, end: 2 })).to.equal(false);
  });

  it("should return false for values below the range", () => {
    expect(inRange({ value: 0, start: 1, end: 5 })).to.equal(false);
  });

  it("should return false for values above the range", () => {
    expect(inRange({ value: 10, start: 1, end: 5 })).to.equal(false);
  });

  it("should throw if value is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => inRange({ value: "3", start: 1, end: 5 })).to.throw(
      "The 'value' parameter must be a number",
    );
  });

  it("should throw if start is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => inRange({ value: 3, start: "1", end: 5 })).to.throw(
      "The 'start' parameter must be a number",
    );
  });

  it("should throw if end is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => inRange({ value: 3, start: 1, end: "5" })).to.throw(
      "The 'end' parameter must be a number",
    );
  });

  it("should throw if value is NaN", () => {
    expect(() => inRange({ value: Number.NaN, start: 1, end: 5 })).to.throw(
      "The 'value' parameter must be a number",
    );
  });

  it("should throw if start is NaN", () => {
    expect(() => inRange({ value: 3, start: Number.NaN, end: 5 })).to.throw(
      "The 'start' parameter must be a number",
    );
  });

  it("should throw if end is NaN", () => {
    expect(() => inRange({ value: 3, start: 1, end: Number.NaN })).to.throw(
      "The 'end' parameter must be a number",
    );
  });

  it("should handle Infinity bounds", () => {
    expect(
      inRange({ value: 1e10, start: 0, end: Number.POSITIVE_INFINITY }),
    ).to.equal(true);
    expect(
      inRange({ value: -1e10, start: Number.NEGATIVE_INFINITY, end: 0 }),
    ).to.equal(true);
  });
});
