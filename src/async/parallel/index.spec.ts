import { expect } from "chai";
import { describe, it } from "mocha";
import { parallel } from "./index.js";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

describe("parallel", () => {
  it("should preserve input order in results", async () => {
    const results = await parallel({
      items: [10, 30, 5, 20],
      concurrency: 2,
      fn: async (n) => {
        await tick(n);
        return n * 2;
      },
    });

    expect(results.map((r) => (r as { value: number }).value)).to.deep.equal([
      20, 60, 10, 40,
    ]);
  });

  it("should return Promise.allSettled-shaped entries", async () => {
    const results = await parallel({
      items: [1, 2, 3],
      concurrency: 2,
      fn: (n) => n * 10,
    });

    expect(results).to.deep.equal([
      { status: "fulfilled", value: 10 },
      { status: "fulfilled", value: 20 },
      { status: "fulfilled", value: 30 },
    ]);
  });

  it("should respect the concurrency cap", async () => {
    let inFlight = 0;
    let peak = 0;
    const items = Array.from({ length: 10 }, (_, i) => i);

    await parallel({
      items,
      concurrency: 3,
      fn: async () => {
        inFlight++;
        peak = Math.max(peak, inFlight);
        await tick(20);
        inFlight--;
      },
    });

    expect(peak).to.equal(3);
  });

  it("should run serially when concurrency is 1", async () => {
    let inFlight = 0;
    let peak = 0;

    await parallel({
      items: [1, 2, 3, 4],
      concurrency: 1,
      fn: async () => {
        inFlight++;
        peak = Math.max(peak, inFlight);
        await tick(5);
        inFlight--;
      },
    });

    expect(peak).to.equal(1);
  });

  it("should run all in parallel when concurrency >= items.length", async () => {
    let inFlight = 0;
    let peak = 0;
    const items = [1, 2, 3];

    await parallel({
      items,
      concurrency: 10,
      fn: async () => {
        inFlight++;
        peak = Math.max(peak, inFlight);
        await tick(15);
        inFlight--;
      },
    });

    expect(peak).to.equal(3);
  });

  it("should handle empty items array", async () => {
    const results = await parallel({
      items: [],
      concurrency: 5,
      fn: async () => "x",
    });

    expect(results).to.deep.equal([]);
  });

  it("should support sync fn", async () => {
    const results = await parallel({
      items: ["a", "b", "c"],
      concurrency: 2,
      fn: (s) => s.toUpperCase(),
    });

    expect(results).to.deep.equal([
      { status: "fulfilled", value: "A" },
      { status: "fulfilled", value: "B" },
      { status: "fulfilled", value: "C" },
    ]);
  });

  it("should pass index to fn", async () => {
    const seen: Array<[string, number]> = [];
    await parallel({
      items: ["a", "b", "c"],
      concurrency: 1,
      fn: (item, i) => {
        seen.push([item, i]);
      },
    });

    expect(seen).to.deep.equal([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  it("should capture rejections without rejecting the whole call", async () => {
    const results = await parallel({
      items: [1, 2, 3],
      concurrency: 2,
      fn: async (n) => {
        if (n === 2) throw new Error("boom");
        return n;
      },
    });

    expect(results[0]).to.deep.equal({ status: "fulfilled", value: 1 });
    expect(results[1]?.status).to.equal("rejected");
    expect((results[1] as { reason: Error }).reason.message).to.equal("boom");
    expect(results[2]).to.deep.equal({ status: "fulfilled", value: 3 });
  });

  it("should mix fulfilled and rejected results", async () => {
    const results = await parallel({
      items: [1, 2, 3, 4],
      concurrency: 4,
      fn: (n) => {
        if (n % 2 === 0) throw new Error(`even:${n}`);
        return n;
      },
    });

    expect(results.map((r) => r.status)).to.deep.equal([
      "fulfilled",
      "rejected",
      "fulfilled",
      "rejected",
    ]);
  });

  it("should reject pending items when signal aborts mid-flight", async () => {
    const controller = new AbortController();
    const items = Array.from({ length: 8 }, (_, i) => i);

    setTimeout(() => controller.abort(new Error("stop")), 25);

    const results = await parallel({
      items,
      concurrency: 2,
      signal: controller.signal,
      fn: async (n) => {
        await tick(20);
        return n;
      },
    });

    const rejected = results.filter((r) => r.status === "rejected");
    expect(rejected.length).to.be.greaterThan(0);
    expect((rejected[0] as { reason: Error }).reason.message).to.equal("stop");
  });

  it("should throw if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("already"));

    try {
      await parallel({
        items: [1, 2, 3],
        concurrency: 2,
        signal: controller.signal,
        fn: (n) => n,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal("already");
    }
  });

  it("should throw if items is not an array", async () => {
    try {
      await parallel({
        items: "nope" as unknown as number[],
        concurrency: 2,
        fn: (n) => n,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'items' parameter must be an array",
      );
    }
  });

  it("should throw if concurrency is not a positive integer", async () => {
    for (const bad of [0, -1, 1.5, Number.NaN]) {
      try {
        await parallel({
          items: [1],
          concurrency: bad,
          fn: (n) => n,
        });
        expect.fail(`should have thrown for ${bad}`);
      } catch (error) {
        expect((error as Error).message).to.equal(
          "The 'concurrency' parameter must be a positive integer",
        );
      }
    }
  });

  it("should throw if fn is not a function", async () => {
    try {
      await parallel({
        items: [1],
        concurrency: 1,
        fn: "nope" as unknown as (n: number) => number,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'fn' parameter must be a function",
      );
    }
  });

  it("should throw if signal is not an AbortSignal", async () => {
    try {
      await parallel({
        items: [1],
        concurrency: 1,
        fn: (n) => n,
        signal: "nope" as unknown as AbortSignal,
      });
      expect.fail("should have thrown");
    } catch (error) {
      expect((error as Error).message).to.equal(
        "The 'signal' parameter must be an AbortSignal",
      );
    }
  });
});
