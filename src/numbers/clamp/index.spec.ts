import { expect } from "chai";
import { describe, it } from "mocha";
import { clamp } from "./index.js";

describe("clamp", () => {
  it("should return the value when it is inside the range", () => {
    expect(clamp({ value: 5, min: 0, max: 10 })).to.equal(5);
  });

  it("should return min when value is below the range", () => {
    expect(clamp({ value: -5, min: 0, max: 10 })).to.equal(0);
  });

  it("should return max when value is above the range", () => {
    expect(clamp({ value: 15, min: 0, max: 10 })).to.equal(10);
  });

  it("should return value when it equals min (inclusive)", () => {
    expect(clamp({ value: 0, min: 0, max: 10 })).to.equal(0);
  });

  it("should return value when it equals max (inclusive)", () => {
    expect(clamp({ value: 10, min: 0, max: 10 })).to.equal(10);
  });

  it("should handle negative ranges", () => {
    expect(clamp({ value: -3, min: -5, max: 5 })).to.equal(-3);
    expect(clamp({ value: -10, min: -5, max: 0 })).to.equal(-5);
    expect(clamp({ value: 5, min: -5, max: 0 })).to.equal(0);
  });

  it("should swap bounds when min is greater than max", () => {
    expect(clamp({ value: 5, min: 10, max: 0 })).to.equal(5);
    expect(clamp({ value: -5, min: 10, max: 0 })).to.equal(0);
    expect(clamp({ value: 15, min: 10, max: 0 })).to.equal(10);
  });

  it("should return the bound for a zero-width range", () => {
    expect(clamp({ value: 5, min: 1, max: 1 })).to.equal(1);
    expect(clamp({ value: -5, min: 1, max: 1 })).to.equal(1);
    expect(clamp({ value: 1, min: 1, max: 1 })).to.equal(1);
  });

  it("should handle floating-point values", () => {
    expect(clamp({ value: 1.5, min: 1, max: 2 })).to.equal(1.5);
    expect(clamp({ value: 2.5, min: 1, max: 2 })).to.equal(2);
    expect(clamp({ value: 0.5, min: 1, max: 2 })).to.equal(1);
  });

  it("should throw if value is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => clamp({ value: "5", min: 0, max: 10 })).to.throw(
      "The 'value' parameter must be a number",
    );
  });

  it("should throw if min is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => clamp({ value: 5, min: "0", max: 10 })).to.throw(
      "The 'min' parameter must be a number",
    );
  });

  it("should throw if max is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => clamp({ value: 5, min: 0, max: "10" })).to.throw(
      "The 'max' parameter must be a number",
    );
  });

  it("should throw if value is NaN", () => {
    expect(() => clamp({ value: Number.NaN, min: 0, max: 10 })).to.throw(
      "The 'value' parameter must be a number",
    );
  });

  it("should throw if min is NaN", () => {
    expect(() => clamp({ value: 5, min: Number.NaN, max: 10 })).to.throw(
      "The 'min' parameter must be a number",
    );
  });

  it("should throw if max is NaN", () => {
    expect(() => clamp({ value: 5, min: 0, max: Number.NaN })).to.throw(
      "The 'max' parameter must be a number",
    );
  });

  it("should handle Infinity bounds", () => {
    expect(
      clamp({ value: 1e10, min: 0, max: Number.POSITIVE_INFINITY }),
    ).to.equal(1e10);
    expect(
      clamp({ value: -1e10, min: Number.NEGATIVE_INFINITY, max: 0 }),
    ).to.equal(-1e10);
    expect(
      clamp({
        value: 5,
        min: Number.NEGATIVE_INFINITY,
        max: Number.POSITIVE_INFINITY,
      }),
    ).to.equal(5);
  });
});
