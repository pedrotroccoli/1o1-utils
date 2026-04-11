import { expect } from "chai";
import { describe, it } from "mocha";
import { sleep } from "./index.js";

describe("sleep", () => {
  it("should resolve after the specified duration", async () => {
    const start = Date.now();
    await sleep({ ms: 50 });
    const elapsed = Date.now() - start;
    expect(elapsed).to.be.at.least(40);
  });

  it("should resolve with ms: 0", async () => {
    const result = sleep({ ms: 0 });
    expect(result).to.be.instanceOf(Promise);
    await result;
  });

  it("should return a Promise", () => {
    const result = sleep({ ms: 0 });
    expect(result).to.be.instanceOf(Promise);
  });

  it("should throw for a negative ms", () => {
    expect(() => sleep({ ms: -1 })).to.throw(
      "The 'ms' parameter must be a non-negative number",
    );
  });

  it("should throw for a non-number ms", () => {
    // @ts-expect-error - testing invalid input
    expect(() => sleep({ ms: "100" })).to.throw(
      "The 'ms' parameter must be a number",
    );
  });

  it("should throw for NaN", () => {
    expect(() => sleep({ ms: Number.NaN })).to.throw(
      "The 'ms' parameter must be a number",
    );
  });
});
