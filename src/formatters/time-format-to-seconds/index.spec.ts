import { expect } from "chai";
import { describe, it } from "mocha";
import { secondsToTimeFormat } from "../seconds-to-time-format/index.js";
import { timeFormatToSeconds } from "./index.js";

describe("timeFormatToSeconds", () => {
  it("should parse '00:00' as 0", () => {
    expect(timeFormatToSeconds({ time: "00:00" })).to.equal(0);
  });

  it("should parse MM:SS form", () => {
    expect(timeFormatToSeconds({ time: "00:30" })).to.equal(30);
    expect(timeFormatToSeconds({ time: "01:30" })).to.equal(90);
    expect(timeFormatToSeconds({ time: "59:59" })).to.equal(3599);
  });

  it("should parse H:MM:SS form (unpadded hours)", () => {
    expect(timeFormatToSeconds({ time: "1:00:00" })).to.equal(3600);
    expect(timeFormatToSeconds({ time: "1:01:01" })).to.equal(3661);
    expect(timeFormatToSeconds({ time: "2:02:05" })).to.equal(7325);
  });

  it("should parse HH:MM:SS form (padded hours)", () => {
    expect(timeFormatToSeconds({ time: "01:00:00" })).to.equal(3600);
    expect(timeFormatToSeconds({ time: "01:01:01" })).to.equal(3661);
  });

  it("should accept hours greater than 24", () => {
    expect(timeFormatToSeconds({ time: "25:00:00" })).to.equal(90000);
    expect(timeFormatToSeconds({ time: "100:00:00" })).to.equal(360000);
  });

  it("should accept unpadded single-digit minutes/seconds in 3-part form", () => {
    expect(timeFormatToSeconds({ time: "1:2:3" })).to.equal(3723);
  });

  it("should round-trip with secondsToTimeFormat", () => {
    for (const n of [
      0, 1, 30, 59, 60, 90, 599, 3599, 3600, 3661, 7325, 90000,
    ]) {
      const formatted = secondsToTimeFormat({ seconds: n });
      expect(timeFormatToSeconds({ time: formatted })).to.equal(n);
    }
  });

  it("should round-trip with secondsToTimeFormat when padHours is true", () => {
    for (const n of [3600, 3661, 90000]) {
      const formatted = secondsToTimeFormat({ seconds: n, padHours: true });
      expect(timeFormatToSeconds({ time: formatted })).to.equal(n);
    }
  });

  it("should throw if time is not a string", () => {
    // @ts-expect-error - testing invalid input
    expect(() => timeFormatToSeconds({ time: 90 })).to.throw(
      "The 'time' parameter must be a string",
    );
    // @ts-expect-error - testing invalid input
    expect(() => timeFormatToSeconds({ time: null })).to.throw(
      "The 'time' parameter must be a string",
    );
  });

  it("should throw on empty string", () => {
    expect(() => timeFormatToSeconds({ time: "" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
  });

  it("should throw on single-segment input", () => {
    expect(() => timeFormatToSeconds({ time: "90" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
  });

  it("should throw on more than 3 segments", () => {
    expect(() => timeFormatToSeconds({ time: "1:2:3:4" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
  });

  it("should throw on non-digit segments", () => {
    expect(() => timeFormatToSeconds({ time: "1:abc" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
    expect(() => timeFormatToSeconds({ time: "01:-5" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
    expect(() => timeFormatToSeconds({ time: " 01:30" })).to.throw(
      "must match 'MM:SS' or 'HH:MM:SS' format",
    );
  });

  it("should throw when minutes >= 60 in 2-part form", () => {
    expect(() => timeFormatToSeconds({ time: "60:00" })).to.throw(
      "Minutes must be 0-59 in 'MM:SS' format",
    );
  });

  it("should throw when seconds >= 60 in 2-part form", () => {
    expect(() => timeFormatToSeconds({ time: "00:60" })).to.throw(
      "Seconds must be 0-59",
    );
  });

  it("should throw when minutes >= 60 in 3-part form", () => {
    expect(() => timeFormatToSeconds({ time: "1:60:00" })).to.throw(
      "Minutes must be 0-59",
    );
  });

  it("should throw when seconds >= 60 in 3-part form", () => {
    expect(() => timeFormatToSeconds({ time: "1:00:60" })).to.throw(
      "Seconds must be 0-59",
    );
  });
});
