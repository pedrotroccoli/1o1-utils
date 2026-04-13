import { expect } from "chai";
import { describe, it } from "mocha";
import { debounce } from "./index.js";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("debounce", () => {
  it("should call the function after the specified delay", async () => {
    let callCount = 0;
    const debounced = debounce({ fn: () => callCount++, ms: 50 });

    debounced();
    expect(callCount).to.equal(0);

    await wait(80);
    expect(callCount).to.equal(1);
  });

  it("should reset the timer on subsequent calls", async () => {
    let callCount = 0;
    const debounced = debounce({ fn: () => callCount++, ms: 50 });

    debounced();
    await wait(30);
    debounced();
    await wait(30);
    expect(callCount).to.equal(0);

    await wait(40);
    expect(callCount).to.equal(1);
  });

  it("should pass arguments to the function", async () => {
    let received: unknown[] = [];
    const debounced = debounce({
      fn: (...args: unknown[]) => {
        received = args;
      },
      ms: 50,
    });

    debounced("a", "b");
    await wait(80);
    expect(received).to.deep.equal(["a", "b"]);
  });

  it("should use the arguments from the last call", async () => {
    let received: unknown[] = [];
    const debounced = debounce({
      fn: (...args: unknown[]) => {
        received = args;
      },
      ms: 50,
    });

    debounced("first");
    debounced("second");
    await wait(80);
    expect(received).to.deep.equal(["second"]);
  });

  it("should cancel pending execution", async () => {
    let callCount = 0;
    const debounced = debounce({ fn: () => callCount++, ms: 50 });

    debounced();
    debounced.cancel();
    await wait(80);
    expect(callCount).to.equal(0);
  });

  it("should handle multiple independent debounce cycles", async () => {
    let callCount = 0;
    const debounced = debounce({ fn: () => callCount++, ms: 50 });

    debounced();
    await wait(80);
    expect(callCount).to.equal(1);

    debounced();
    await wait(80);
    expect(callCount).to.equal(2);
  });

  it("should throw an error if fn is not a function", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => debounce({ fn: "not a function", ms: 100 })).to.throw(
      "The 'fn' parameter must be a function",
    );
  });

  it("should throw an error if ms is not a number", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => debounce({ fn: () => {}, ms: "100" })).to.throw(
      "The 'ms' parameter must be a number",
    );
  });

  it("should throw an error if ms is negative", () => {
    expect(() => debounce({ fn: () => {}, ms: -1 })).to.throw(
      "The 'ms' parameter must be a non-negative number",
    );
  });
});
