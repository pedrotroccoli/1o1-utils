import { expect } from "chai";
import { describe, it } from "mocha";
import { throttle } from "./index.js";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("throttle", () => {
  it("should execute immediately on the first call", () => {
    let callCount = 0;
    const throttled = throttle({ fn: () => callCount++, ms: 100 });

    throttled();
    expect(callCount).to.equal(1);
  });

  it("should throttle subsequent calls within the window", async () => {
    let callCount = 0;
    const throttled = throttle({ fn: () => callCount++, ms: 100 });

    throttled();
    throttled();
    throttled();
    expect(callCount).to.equal(1);

    await wait(130);
    expect(callCount).to.equal(2);
  });

  it("should fire trailing call with the most recent arguments", async () => {
    let received: unknown[] = [];
    const throttled = throttle({
      fn: (...args: unknown[]) => {
        received = args;
      },
      ms: 100,
    });

    throttled("first");
    throttled("second");
    throttled("third");

    expect(received).to.deep.equal(["first"]);

    await wait(130);
    expect(received).to.deep.equal(["third"]);
  });

  it("should allow a new call after the window expires", async () => {
    let callCount = 0;
    const throttled = throttle({ fn: () => callCount++, ms: 50 });

    throttled();
    expect(callCount).to.equal(1);

    await wait(80);
    throttled();
    expect(callCount).to.equal(2);
  });

  it("should cancel pending trailing call", async () => {
    let callCount = 0;
    const throttled = throttle({ fn: () => callCount++, ms: 100 });

    throttled();
    throttled();
    expect(callCount).to.equal(1);

    throttled.cancel();
    await wait(130);
    expect(callCount).to.equal(1);
  });

  it("should pass arguments to the function on immediate call", () => {
    let received: unknown[] = [];
    const throttled = throttle({
      fn: (...args: unknown[]) => {
        received = args;
      },
      ms: 100,
    });

    throttled("a", "b");
    expect(received).to.deep.equal(["a", "b"]);
  });

  it("should throw an error if fn is not a function", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => throttle({ fn: "not a function", ms: 100 })).to.throw(
      "The 'fn' parameter must be a function",
    );
  });

  it("should throw an error if ms is not a number", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => throttle({ fn: () => {}, ms: "100" })).to.throw(
      "The 'ms' parameter must be a number",
    );
  });

  it("should throw an error if ms is negative", () => {
    expect(() => throttle({ fn: () => {}, ms: -1 })).to.throw(
      "The 'ms' parameter must be a non-negative number",
    );
  });
});
