import { expect } from "chai";
import { describe, it } from "mocha";
import { secondsToTimeFormat } from "./index.js";

describe("secondsToTimeFormat", () => {
  it("should format zero as '00:00'", () => {
    expect(secondsToTimeFormat({ seconds: 0 })).to.equal("00:00");
  });

  it("should format under-minute values with zero-padded minutes", () => {
    expect(secondsToTimeFormat({ seconds: 5 })).to.equal("00:05");
    expect(secondsToTimeFormat({ seconds: 30 })).to.equal("00:30");
    expect(secondsToTimeFormat({ seconds: 59 })).to.equal("00:59");
  });

  it("should format exactly one minute as '01:00'", () => {
    expect(secondsToTimeFormat({ seconds: 60 })).to.equal("01:00");
  });

  it("should format under-hour values as MM:SS", () => {
    expect(secondsToTimeFormat({ seconds: 90 })).to.equal("01:30");
    expect(secondsToTimeFormat({ seconds: 599 })).to.equal("09:59");
    expect(secondsToTimeFormat({ seconds: 3599 })).to.equal("59:59");
  });

  it("should format exactly one hour as '1:00:00' by default", () => {
    expect(secondsToTimeFormat({ seconds: 3600 })).to.equal("1:00:00");
  });

  it("should format hour-plus values as H:MM:SS by default", () => {
    expect(secondsToTimeFormat({ seconds: 3661 })).to.equal("1:01:01");
    expect(secondsToTimeFormat({ seconds: 7325 })).to.equal("2:02:05");
  });

  it("should pad hours to two digits when padHours is true", () => {
    expect(secondsToTimeFormat({ seconds: 3661, padHours: true })).to.equal(
      "01:01:01",
    );
    expect(secondsToTimeFormat({ seconds: 3600, padHours: true })).to.equal(
      "01:00:00",
    );
  });

  it("should ignore padHours when output has no hours", () => {
    expect(secondsToTimeFormat({ seconds: 90, padHours: true })).to.equal(
      "01:30",
    );
  });

  it("should not cap hours at 24", () => {
    expect(secondsToTimeFormat({ seconds: 90000 })).to.equal("25:00:00");
    expect(secondsToTimeFormat({ seconds: 360000 })).to.equal("100:00:00");
    expect(secondsToTimeFormat({ seconds: 360000, padHours: true })).to.equal(
      "100:00:00",
    );
  });

  it("should floor non-integer seconds", () => {
    expect(secondsToTimeFormat({ seconds: 90.9 })).to.equal("01:30");
    expect(secondsToTimeFormat({ seconds: 0.5 })).to.equal("00:00");
  });

  it("should throw if seconds is not a number", () => {
    // @ts-expect-error - testing invalid input
    expect(() => secondsToTimeFormat({ seconds: "90" })).to.throw(
      "The 'seconds' parameter must be a finite number",
    );
  });

  it("should throw if seconds is NaN", () => {
    expect(() => secondsToTimeFormat({ seconds: Number.NaN })).to.throw(
      "The 'seconds' parameter must be a finite number",
    );
  });

  it("should throw if seconds is Infinity", () => {
    expect(() =>
      secondsToTimeFormat({ seconds: Number.POSITIVE_INFINITY }),
    ).to.throw("The 'seconds' parameter must be a finite number");
    expect(() =>
      secondsToTimeFormat({ seconds: Number.NEGATIVE_INFINITY }),
    ).to.throw("The 'seconds' parameter must be a finite number");
  });

  it("should throw if seconds is negative", () => {
    expect(() => secondsToTimeFormat({ seconds: -1 })).to.throw(
      "The 'seconds' parameter must be non-negative",
    );
    expect(() => secondsToTimeFormat({ seconds: -0.5 })).to.throw(
      "The 'seconds' parameter must be non-negative",
    );
  });
});
