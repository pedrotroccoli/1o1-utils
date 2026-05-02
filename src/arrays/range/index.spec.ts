import { expect } from "chai";
import { describe, it } from "mocha";
import { range } from "./index.js";

describe("range", () => {
  it("should generate a sequence from 0 to end when only end is given", () => {
    expect(range({ end: 5 })).to.deep.equal([0, 1, 2, 3, 4]);
  });

  it("should generate a sequence from start to end", () => {
    expect(range({ start: 1, end: 5 })).to.deep.equal([1, 2, 3, 4]);
  });

  it("should respect a positive step", () => {
    expect(range({ start: 0, end: 10, step: 2 })).to.deep.equal([
      0, 2, 4, 6, 8,
    ]);
  });

  it("should respect a negative step", () => {
    expect(range({ start: 5, end: 0, step: -1 })).to.deep.equal([
      5, 4, 3, 2, 1,
    ]);
  });

  it("should auto-flip step to -1 when start > end and step is omitted", () => {
    expect(range({ start: 5, end: 0 })).to.deep.equal([5, 4, 3, 2, 1]);
  });

  it("should return an empty array when start equals end", () => {
    expect(range({ start: 3, end: 3 })).to.deep.equal([]);
  });

  it("should return an empty array when end is 0 and start is 0", () => {
    expect(range({ end: 0 })).to.deep.equal([]);
  });

  it("should support non-integer steps", () => {
    expect(range({ start: 0, end: 1, step: 0.25 })).to.deep.equal([
      0, 0.25, 0.5, 0.75,
    ]);
  });

  it("should support negative start values", () => {
    expect(range({ start: -2, end: 2 })).to.deep.equal([-2, -1, 0, 1]);
  });

  it("should return an empty array when step direction does not reach end", () => {
    expect(range({ start: 0, end: 5, step: -1 })).to.deep.equal([]);
    expect(range({ start: 5, end: 0, step: 1 })).to.deep.equal([]);
  });

  it("should not include end in the output", () => {
    expect(range({ start: 0, end: 3 })).to.deep.equal([0, 1, 2]);
  });

  it("should throw an error if step is 0", () => {
    expect(() => range({ start: 0, end: 5, step: 0 })).to.throw(
      "The 'step' parameter cannot be 0",
    );
  });

  it("should throw an error if start is not a number", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      range({ start: "0", end: 5 }),
    ).to.throw("The 'start' parameter must be a finite number");
  });

  it("should throw an error if end is not a number", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      range({ end: "5" }),
    ).to.throw("The 'end' parameter must be a finite number");
  });

  it("should throw an error if step is not a number", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      range({ start: 0, end: 5, step: "1" }),
    ).to.throw("The 'step' parameter must be a finite number");
  });

  it("should throw an error if start is NaN", () => {
    expect(() => range({ start: Number.NaN, end: 5 })).to.throw(
      "The 'start' parameter must be a finite number",
    );
  });

  it("should throw an error if end is NaN", () => {
    expect(() => range({ end: Number.NaN })).to.throw(
      "The 'end' parameter must be a finite number",
    );
  });

  it("should throw an error if step is NaN", () => {
    expect(() => range({ start: 0, end: 5, step: Number.NaN })).to.throw(
      "The 'step' parameter must be a finite number",
    );
  });

  it("should throw an error if start is Infinity", () => {
    expect(() => range({ start: Number.POSITIVE_INFINITY, end: 5 })).to.throw(
      "The 'start' parameter must be a finite number",
    );
  });

  it("should throw an error if start is -Infinity", () => {
    expect(() => range({ start: Number.NEGATIVE_INFINITY, end: 5 })).to.throw(
      "The 'start' parameter must be a finite number",
    );
  });

  it("should throw an error if end is Infinity", () => {
    expect(() => range({ end: Number.POSITIVE_INFINITY })).to.throw(
      "The 'end' parameter must be a finite number",
    );
  });

  it("should throw an error if end is -Infinity", () => {
    expect(() => range({ end: Number.NEGATIVE_INFINITY })).to.throw(
      "The 'end' parameter must be a finite number",
    );
  });

  it("should throw an error if step is Infinity", () => {
    expect(() =>
      range({ start: 0, end: 5, step: Number.POSITIVE_INFINITY }),
    ).to.throw("The 'step' parameter must be a finite number");
  });

  it("should throw an error if step is -Infinity", () => {
    expect(() =>
      range({ start: 0, end: 5, step: Number.NEGATIVE_INFINITY }),
    ).to.throw("The 'step' parameter must be a finite number");
  });

  it("should handle floating-point step without overshooting end", () => {
    const result = range({ start: 0, end: 0.3, step: 0.1 });
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal(0);
    expect(result[1]).to.be.closeTo(0.1, 1e-9);
    expect(result[2]).to.be.closeTo(0.2, 1e-9);
  });
});
