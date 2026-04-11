import { expect } from "chai";
import { describe, it } from "mocha";
import { retry } from "./index.js";

describe("retry", () => {
  it("should return the result on first success", async () => {
    const result = await retry({ fn: () => "ok" });
    expect(result).to.equal("ok");
  });

  it("should return the result of an async function", async () => {
    const result = await retry({ fn: async () => 42 });
    expect(result).to.equal(42);
  });

  it("should retry and succeed on a later attempt", async () => {
    let calls = 0;
    const result = await retry({
      fn: () => {
        calls++;
        if (calls < 3) throw new Error("fail");
        return "success";
      },
      delay: 0,
    });

    expect(result).to.equal("success");
    expect(calls).to.equal(3);
  });

  it("should throw the last error after all attempts fail", async () => {
    try {
      await retry({
        fn: () => {
          throw new Error("always fails");
        },
        attempts: 3,
        delay: 0,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal("always fails");
    }
  });

  it("should default to 3 attempts", async () => {
    let calls = 0;
    try {
      await retry({
        fn: () => {
          calls++;
          throw new Error("fail");
        },
        delay: 0,
      });
    } catch {
      // expected
    }
    expect(calls).to.equal(3);
  });

  it("should respect custom attempts", async () => {
    let calls = 0;
    try {
      await retry({
        fn: () => {
          calls++;
          throw new Error("fail");
        },
        attempts: 5,
        delay: 0,
      });
    } catch {
      // expected
    }
    expect(calls).to.equal(5);
  });

  it("should call onRetry with error and attempt number", async () => {
    const retries: { error: string; attempt: number }[] = [];

    try {
      await retry({
        fn: () => {
          throw new Error("boom");
        },
        attempts: 3,
        delay: 0,
        onRetry: (error, attempt) => {
          retries.push({ error: (error as Error).message, attempt });
        },
      });
    } catch {
      // expected
    }

    expect(retries).to.deep.equal([
      { error: "boom", attempt: 1 },
      { error: "boom", attempt: 2 },
    ]);
  });

  it("should use fixed delay between retries", async () => {
    const timestamps: number[] = [];

    try {
      await retry({
        fn: () => {
          timestamps.push(Date.now());
          throw new Error("fail");
        },
        attempts: 3,
        delay: 50,
        backoff: "fixed",
      });
    } catch {
      // expected
    }

    const gap1 = timestamps[1] - timestamps[0];
    const gap2 = timestamps[2] - timestamps[1];
    expect(gap1).to.be.at.least(40);
    expect(gap2).to.be.at.least(40);
    expect(Math.abs(gap2 - gap1)).to.be.at.most(30);
  });

  it("should use exponential backoff", async () => {
    const timestamps: number[] = [];

    try {
      await retry({
        fn: () => {
          timestamps.push(Date.now());
          throw new Error("fail");
        },
        attempts: 3,
        delay: 30,
        backoff: "exponential",
      });
    } catch {
      // expected
    }

    const gap1 = timestamps[1] - timestamps[0]; // delay * 2^0 = 30ms
    const gap2 = timestamps[2] - timestamps[1]; // delay * 2^1 = 60ms
    expect(gap1).to.be.at.least(20);
    expect(gap2).to.be.at.least(50);
    expect(gap2).to.be.greaterThan(gap1);
  });

  it("should work with delay: 0", async () => {
    let calls = 0;
    const result = await retry({
      fn: () => {
        calls++;
        if (calls < 2) throw new Error("fail");
        return "ok";
      },
      delay: 0,
    });

    expect(result).to.equal("ok");
  });

  it("should not retry with attempts: 1", async () => {
    let calls = 0;
    try {
      await retry({
        fn: () => {
          calls++;
          throw new Error("fail");
        },
        attempts: 1,
        delay: 0,
      });
    } catch {
      // expected
    }
    expect(calls).to.equal(1);
  });

  it("should reject if fn is not a function", async () => {
    try {
      // @ts-expect-error - testing invalid input
      await retry({ fn: "not a function" });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'fn' parameter must be a function",
      );
    }
  });

  it("should reject if attempts is 0", async () => {
    try {
      await retry({ fn: () => "ok", attempts: 0 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'attempts' parameter must be a positive integer",
      );
    }
  });

  it("should reject if attempts is negative", async () => {
    try {
      await retry({ fn: () => "ok", attempts: -1 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'attempts' parameter must be a positive integer",
      );
    }
  });

  it("should reject if delay is negative", async () => {
    try {
      await retry({ fn: () => "ok", delay: -1 });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'delay' parameter must be a non-negative number",
      );
    }
  });

  it("should reject if backoff is invalid", async () => {
    try {
      // @ts-expect-error - testing invalid input
      await retry({ fn: () => "ok", backoff: "linear" });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'backoff' parameter must be 'fixed' or 'exponential'",
      );
    }
  });
});
