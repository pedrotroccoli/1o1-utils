import { expect } from "chai";
import { describe, it } from "mocha";
import { TimeoutError, withTimeout } from "./index.js";

const delayed = <T>(value: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const delayedReject = (error: unknown, ms: number): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(error), ms));

describe("withTimeout", () => {
  it("should resolve with value when promise settles before timeout", async () => {
    const result = await withTimeout({
      promise: delayed("ok", 10),
      ms: 100,
    });
    expect(result).to.equal("ok");
  });

  it("should reject with TimeoutError when timeout elapses first", async () => {
    try {
      await withTimeout({ promise: delayed("slow", 100), ms: 20 });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(TimeoutError);
      expect(error).to.be.instanceOf(Error);
      expect((error as TimeoutError).name).to.equal("TimeoutError");
      expect((error as TimeoutError).message).to.equal(
        "Operation timed out after 20ms",
      );
    }
  });

  it("should forward the original rejection when promise rejects before timeout", async () => {
    const original = new Error("original failure");
    try {
      await withTimeout({
        promise: delayedReject(original, 10),
        ms: 100,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(original);
    }
  });

  it("should use a custom string message on timeout", async () => {
    try {
      await withTimeout({
        promise: delayed("slow", 100),
        ms: 10,
        message: "API too slow",
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as TimeoutError).message).to.equal("API too slow");
    }
  });

  it("should invoke a lazy message function only on timeout", async () => {
    let calls = 0;
    const factory = () => {
      calls++;
      return "lazy timeout";
    };

    await withTimeout({
      promise: delayed("ok", 5),
      ms: 50,
      message: factory,
    });
    expect(calls).to.equal(0);

    try {
      await withTimeout({
        promise: delayed("slow", 50),
        ms: 5,
        message: factory,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(calls).to.equal(1);
      expect((error as TimeoutError).message).to.equal("lazy timeout");
    }
  });

  it("should throw synchronously if promise is not thenable", () => {
    // @ts-expect-error - testing invalid input
    expect(() => withTimeout({ promise: 42, ms: 100 })).to.throw(
      "The 'promise' parameter must be a Promise",
    );
  });

  it("should throw synchronously if ms is not a number", () => {
    expect(() =>
      // @ts-expect-error - testing invalid input
      withTimeout({ promise: Promise.resolve(), ms: "100" }),
    ).to.throw("The 'ms' parameter must be a number");
  });

  it("should throw synchronously if ms is NaN", () => {
    expect(() =>
      withTimeout({ promise: Promise.resolve(), ms: Number.NaN }),
    ).to.throw("The 'ms' parameter must be a number");
  });

  it("should throw synchronously if ms is negative", () => {
    expect(() => withTimeout({ promise: Promise.resolve(), ms: -1 })).to.throw(
      "The 'ms' parameter must be a non-negative number",
    );
  });

  it("should throw synchronously if signal is not an AbortSignal", () => {
    expect(() =>
      withTimeout({
        promise: Promise.resolve(),
        ms: 100,
        // @ts-expect-error - testing invalid input
        signal: {},
      }),
    ).to.throw("The 'signal' parameter must be an AbortSignal");
  });

  it("should reject immediately with signal.reason if signal is already aborted", async () => {
    const controller = new AbortController();
    const reason = new Error("already aborted");
    controller.abort(reason);

    try {
      await withTimeout({
        promise: delayed("slow", 100),
        ms: 100,
        signal: controller.signal,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(reason);
    }
  });

  it("should reject with signal.reason when aborted during wait", async () => {
    const controller = new AbortController();
    const reason = new Error("aborted mid-flight");

    setTimeout(() => controller.abort(reason), 10);

    try {
      await withTimeout({
        promise: delayed("slow", 100),
        ms: 100,
        signal: controller.signal,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(reason);
    }
  });

  it("should not reject if signal aborts after promise resolves", async () => {
    const controller = new AbortController();
    const result = await withTimeout({
      promise: delayed("ok", 5),
      ms: 100,
      signal: controller.signal,
    });
    expect(result).to.equal("ok");

    controller.abort(new Error("late abort"));
    await new Promise((r) => setTimeout(r, 10));
  });

  it("should support ms: 0 (rejects on next tick)", async () => {
    try {
      await withTimeout({ promise: delayed("slow", 50), ms: 0 });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(TimeoutError);
    }
  });
});
