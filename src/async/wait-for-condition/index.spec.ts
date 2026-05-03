import { expect } from "chai";
import { describe, it } from "mocha";
import { TimeoutError } from "../with-timeout/index.js";
import { waitForCondition } from "./index.js";

describe("waitForCondition", () => {
  it("should resolve immediately when condition is true on first call", async () => {
    let calls = 0;
    await waitForCondition({
      condition: () => {
        calls++;
        return true;
      },
      interval: 10,
      timeout: 100,
    });
    expect(calls).to.equal(1);
  });

  it("should resolve after the condition becomes true", async () => {
    let calls = 0;
    await waitForCondition({
      condition: () => {
        calls++;
        return calls >= 3;
      },
      interval: 5,
      timeout: 200,
    });
    expect(calls).to.equal(3);
  });

  it("should support async conditions", async () => {
    let calls = 0;
    await waitForCondition({
      condition: async () => {
        calls++;
        return calls >= 2;
      },
      interval: 5,
      timeout: 200,
    });
    expect(calls).to.equal(2);
  });

  it("should reject with TimeoutError when condition stays falsy", async () => {
    try {
      await waitForCondition({
        condition: () => false,
        interval: 5,
        timeout: 20,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(TimeoutError);
      expect(error).to.be.instanceOf(Error);
      expect((error as TimeoutError).name).to.equal("TimeoutError");
      expect((error as TimeoutError).message).to.equal(
        "Condition not met within 20ms",
      );
    }
  });

  it("should use a custom string message on timeout", async () => {
    try {
      await waitForCondition({
        condition: () => false,
        interval: 5,
        timeout: 10,
        message: "element never appeared",
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as TimeoutError).message).to.equal(
        "element never appeared",
      );
    }
  });

  it("should invoke a lazy message function only on timeout", async () => {
    let calls = 0;
    const factory = () => {
      calls++;
      return "lazy";
    };

    await waitForCondition({
      condition: () => true,
      interval: 5,
      timeout: 50,
      message: factory,
    });
    expect(calls).to.equal(0);

    try {
      await waitForCondition({
        condition: () => false,
        interval: 5,
        timeout: 10,
        message: factory,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(calls).to.equal(1);
      expect((error as TimeoutError).message).to.equal("lazy");
    }
  });

  it("should propagate a synchronous error from condition", async () => {
    const original = new Error("boom");
    let calls = 0;
    try {
      await waitForCondition({
        condition: () => {
          calls++;
          throw original;
        },
        interval: 5,
        timeout: 100,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(original);
      expect(calls).to.equal(1);
    }
  });

  it("should propagate an async rejection from condition", async () => {
    const original = new Error("async boom");
    try {
      await waitForCondition({
        condition: async () => {
          throw original;
        },
        interval: 5,
        timeout: 100,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(original);
    }
  });

  it("should reject immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    const reason = new Error("already aborted");
    controller.abort(reason);

    let calls = 0;
    try {
      await waitForCondition({
        condition: () => {
          calls++;
          return false;
        },
        interval: 5,
        timeout: 100,
        signal: controller.signal,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(reason);
      expect(calls).to.equal(0);
    }
  });

  it("should reject with signal.reason when aborted during polling", async () => {
    const controller = new AbortController();
    const reason = new Error("aborted mid-flight");

    setTimeout(() => controller.abort(reason), 10);

    try {
      await waitForCondition({
        condition: () => false,
        interval: 5,
        timeout: 200,
        signal: controller.signal,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.equal(reason);
    }
  });

  it("should reject if condition is not a function", async () => {
    try {
      // @ts-expect-error - testing invalid input
      await waitForCondition({ condition: 42 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'condition' parameter must be a function",
      );
    }
  });

  it("should reject if interval is not a number", async () => {
    try {
      await waitForCondition({
        condition: () => true,
        // @ts-expect-error - testing invalid input
        interval: "100",
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'interval' parameter must be a number",
      );
    }
  });

  it("should reject if interval is NaN", async () => {
    try {
      await waitForCondition({
        condition: () => true,
        interval: Number.NaN,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'interval' parameter must be a number",
      );
    }
  });

  it("should reject if interval is negative", async () => {
    try {
      await waitForCondition({ condition: () => true, interval: -1 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'interval' parameter must be a non-negative number",
      );
    }
  });

  it("should reject if timeout is not a number", async () => {
    try {
      await waitForCondition({
        condition: () => true,
        // @ts-expect-error - testing invalid input
        timeout: "100",
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'timeout' parameter must be a number",
      );
    }
  });

  it("should reject if timeout is NaN", async () => {
    try {
      await waitForCondition({
        condition: () => true,
        timeout: Number.NaN,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'timeout' parameter must be a number",
      );
    }
  });

  it("should reject if timeout is negative", async () => {
    try {
      await waitForCondition({ condition: () => true, timeout: -1 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'timeout' parameter must be a non-negative number",
      );
    }
  });

  it("should reject if signal is not an AbortSignal", async () => {
    try {
      await waitForCondition({
        condition: () => true,
        // @ts-expect-error - testing invalid input
        signal: {},
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'signal' parameter must be an AbortSignal",
      );
    }
  });

  it("should resolve when timeout is 0 and initial check is truthy", async () => {
    await waitForCondition({
      condition: () => true,
      interval: 5,
      timeout: 0,
    });
  });

  it("should reject with TimeoutError when timeout is 0 and initial check is falsy", async () => {
    try {
      await waitForCondition({
        condition: () => false,
        interval: 5,
        timeout: 0,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(TimeoutError);
    }
  });

  it("should not emit unhandledRejection when condition rejects after timeout wins", async () => {
    const captured: unknown[] = [];
    const listener = (reason: unknown) => captured.push(reason);
    process.on("unhandledRejection", listener);

    try {
      await waitForCondition({
        condition: () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("late condition")), 50),
          ),
        interval: 100,
        timeout: 10,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(TimeoutError);
    }

    await new Promise((resolve) => setTimeout(resolve, 80));
    process.off("unhandledRejection", listener);

    expect(captured).to.have.length(0);
  });
});
