import { expect } from "chai";
import { describe, it } from "mocha";
import { sleep } from "../../async/sleep/index.js";
import { memo } from "./index.js";

describe("memo", () => {
  it("should cache the result for repeated calls with the same args", async () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        return n * 2;
      },
    });

    expect(memoized(5)).to.equal(10);
    expect(memoized(5)).to.equal(10);
    expect(memoized(5)).to.equal(10);
    expect(callCount).to.equal(1);
  });

  it("should recompute for different args", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        return n * 2;
      },
    });

    expect(memoized(1)).to.equal(2);
    expect(memoized(2)).to.equal(4);
    expect(memoized(3)).to.equal(6);
    expect(callCount).to.equal(3);
  });

  it("should forward all arguments to the wrapped function", () => {
    let received: number[] = [];
    const memoized = memo({
      fn: (...args: number[]) => {
        received = args;
        return args.reduce((a, b) => a + b, 0);
      },
    });

    expect(memoized(1, 2, 3)).to.equal(6);
    expect(received).to.deep.equal([1, 2, 3]);
  });

  it("should use the custom key function when provided", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (s: string) => {
        callCount++;
        return s.length;
      },
      key: (args) => args[0].toLowerCase(),
    });

    expect(memoized("Hello")).to.equal(5);
    expect(memoized("HELLO")).to.equal(5);
    expect(memoized("hello")).to.equal(5);
    expect(callCount).to.equal(1);
  });

  it("should return the cached value before TTL expires", async () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        return n;
      },
      ttl: 50,
    });

    memoized(1);
    memoized(1);
    memoized(1);
    expect(callCount).to.equal(1);
  });

  it("should recompute after TTL expires", async () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        return n;
      },
      ttl: 10,
    });

    memoized(1);
    expect(callCount).to.equal(1);
    await sleep({ ms: 25 });
    memoized(1);
    expect(callCount).to.equal(2);
  });

  it("should empty the cache on .clear()", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        return n;
      },
    });

    memoized(1);
    memoized(2);
    expect(memoized.size).to.equal(2);
    memoized.clear();
    expect(memoized.size).to.equal(0);
    memoized(1);
    expect(callCount).to.equal(3);
  });

  it("should remove a single entry on .delete(key) and return true/false", () => {
    const memoized = memo({
      fn: (n: number) => n * 10,
    });

    memoized(1);
    memoized(2);
    expect(memoized.size).to.equal(2);
    expect(memoized.delete(1)).to.equal(true);
    expect(memoized.size).to.equal(1);
    expect(memoized.delete(99)).to.equal(false);
  });

  it("should report cache size via .size", () => {
    const memoized = memo({
      fn: (n: number) => n,
    });

    expect(memoized.size).to.equal(0);
    memoized(1);
    expect(memoized.size).to.equal(1);
    memoized(2);
    memoized(3);
    expect(memoized.size).to.equal(3);
    memoized(1);
    expect(memoized.size).to.equal(3);
  });

  it("should preserve the `this` context", () => {
    const obj = {
      multiplier: 7,
      compute: memo({
        fn(this: { multiplier: number }, n: number) {
          return n * this.multiplier;
        },
      }),
    };

    expect(obj.compute(3)).to.equal(21);
  });

  it("should throw if fn is not a function", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      memo({ fn: "not a function" }),
    ).to.throw("The 'fn' parameter must be a function");
  });

  it("should throw if ttl is invalid", () => {
    expect(() => memo({ fn: (n: number) => n, ttl: -1 })).to.throw(
      "The 'ttl' option must be a non-negative number",
    );
    expect(() => memo({ fn: (n: number) => n, ttl: Number.NaN })).to.throw(
      "The 'ttl' option must be a non-negative number",
    );
    expect(() =>
      // @ts-expect-error - we want to test the error case
      memo({ fn: (n: number) => n, ttl: "10" }),
    ).to.throw("The 'ttl' option must be a non-negative number");
  });

  it("should throw if key is not a function", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      memo({ fn: (n: number) => n, key: "not a function" }),
    ).to.throw("The 'key' option must be a function");
  });

  it("should not collide on object args (JSON-fallback default key)", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (obj: { id: number }) => {
        callCount++;
        return obj.id;
      },
    });

    expect(memoized({ id: 1 })).to.equal(1);
    expect(memoized({ id: 2 })).to.equal(2);
    expect(memoized({ id: 1 })).to.equal(1);
    expect(callCount).to.equal(2);
  });

  it("should use the primitive fast path for single primitive arg", () => {
    const memoized = memo({
      fn: (n: number) => n + 1,
    });

    memoized(42);
    expect(memoized.delete(42)).to.equal(true);
    expect(memoized.delete("42")).to.equal(false);
  });

  it("should cache an undefined return value", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number): undefined => {
        callCount++;
        void n;
        return undefined;
      },
    });

    expect(memoized(1)).to.equal(undefined);
    expect(memoized(1)).to.equal(undefined);
    expect(callCount).to.equal(1);
  });

  it("should propagate errors and not cache them", () => {
    let callCount = 0;
    const memoized = memo({
      fn: (n: number) => {
        callCount++;
        if (callCount === 1) {
          throw new Error("boom");
        }
        return n;
      },
    });

    expect(() => memoized(1)).to.throw("boom");
    expect(memoized(1)).to.equal(1);
    expect(callCount).to.equal(2);
  });
});
