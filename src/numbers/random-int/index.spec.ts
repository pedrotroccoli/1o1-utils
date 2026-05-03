import { expect } from "chai";
import { describe, it } from "mocha";
import { randomInt } from "./index.js";

describe("randomInt", () => {
  it("should return an integer within the inclusive range", () => {
    for (let i = 0; i < 100; i++) {
      const v = randomInt({ min: 1, max: 10 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(1);
      expect(v).to.be.at.most(10);
    }
  });

  it("should return min when min equals max", () => {
    expect(randomInt({ min: 7, max: 7 })).to.equal(7);
    expect(randomInt({ min: 0, max: 0 })).to.equal(0);
    expect(randomInt({ min: -3, max: -3 })).to.equal(-3);
  });

  it("should handle a binary range (0 or 1)", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      seen.add(randomInt({ min: 0, max: 1 }));
    }
    expect(seen.has(0)).to.equal(true);
    expect(seen.has(1)).to.equal(true);
    expect(seen.size).to.equal(2);
  });

  it("should handle negative ranges", () => {
    for (let i = 0; i < 100; i++) {
      const v = randomInt({ min: -10, max: -1 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(-10);
      expect(v).to.be.at.most(-1);
    }
  });

  it("should handle ranges that span zero", () => {
    for (let i = 0; i < 100; i++) {
      const v = randomInt({ min: -5, max: 5 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(-5);
      expect(v).to.be.at.most(5);
    }
  });

  it("should swap bounds when min is greater than max", () => {
    for (let i = 0; i < 100; i++) {
      const v = randomInt({ min: 10, max: 1 });
      expect(v).to.be.at.least(1);
      expect(v).to.be.at.most(10);
    }
  });

  it("should handle a large range near 2^32 (fast path)", () => {
    for (let i = 0; i < 50; i++) {
      const v = randomInt({ min: 0, max: 2 ** 32 - 1 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(0);
      expect(v).to.be.at.most(2 ** 32 - 1);
    }
  });

  it("should handle a range that triggers the wide path (above 2^32)", () => {
    for (let i = 0; i < 50; i++) {
      const v = randomInt({ min: 0, max: 2 ** 40 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(0);
      expect(v).to.be.at.most(2 ** 40);
    }
  });

  it("should handle the fast/wide path boundary at range = 2^32 + 1", () => {
    for (let i = 0; i < 50; i++) {
      const v = randomInt({ min: 0, max: 2 ** 32 });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(0);
      expect(v).to.be.at.most(2 ** 32);
    }
  });

  it("should handle the maximum supported range up to MAX_SAFE_INTEGER", () => {
    for (let i = 0; i < 20; i++) {
      const v = randomInt({ min: 0, max: Number.MAX_SAFE_INTEGER });
      expect(Number.isInteger(v)).to.equal(true);
      expect(v).to.be.at.least(0);
      expect(v).to.be.at.most(Number.MAX_SAFE_INTEGER);
    }
  });

  it("should cover all buckets across 1000 samples (distribution sanity)", () => {
    const buckets = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      buckets.add(randomInt({ min: 0, max: 9 }));
    }
    expect(buckets.size).to.equal(10);
  });

  it("should throw if min is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => randomInt({ min: "1", max: 10 })).to.throw(
      "The 'min' parameter must be a number",
    );
  });

  it("should throw if max is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => randomInt({ min: 1, max: "10" })).to.throw(
      "The 'max' parameter must be a number",
    );
  });

  it("should throw if min is NaN", () => {
    expect(() => randomInt({ min: Number.NaN, max: 10 })).to.throw(
      "The 'min' parameter must not be NaN",
    );
  });

  it("should throw if max is NaN", () => {
    expect(() => randomInt({ min: 0, max: Number.NaN })).to.throw(
      "The 'max' parameter must not be NaN",
    );
  });

  it("should throw if min is not an integer", () => {
    expect(() => randomInt({ min: 1.5, max: 10 })).to.throw(
      "The 'min' parameter must be an integer",
    );
  });

  it("should throw if max is not an integer", () => {
    expect(() => randomInt({ min: 0, max: 10.5 })).to.throw(
      "The 'max' parameter must be an integer",
    );
  });

  it("should throw if min is Infinity", () => {
    expect(() =>
      randomInt({ min: Number.NEGATIVE_INFINITY, max: 10 }),
    ).to.throw("The 'min' parameter must be an integer");
  });

  it("should throw if max is Infinity", () => {
    expect(() => randomInt({ min: 0, max: Number.POSITIVE_INFINITY })).to.throw(
      "The 'max' parameter must be an integer",
    );
  });

  it("should throw if range exceeds 2^53", () => {
    expect(() =>
      randomInt({
        min: -Number.MAX_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
      }),
    ).to.throw("The range 'max - min + 1' must not exceed 2^53");
  });
});
