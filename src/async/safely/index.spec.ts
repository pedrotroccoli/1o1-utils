import { expect } from "chai";
import { describe, it } from "mocha";
import { safely } from "./index.js";

describe("safely", () => {
  describe("sync functions", () => {
    it("should return [undefined, value] when fn returns a value", () => {
      const result = safely((x: number) => x * 2)(21);
      expect(result).to.deep.equal([undefined, 42]);
    });

    it("should return [error, undefined] when fn throws", () => {
      const boom = new Error("boom");
      const result = safely(() => {
        throw boom;
      })();
      expect(result).to.deep.equal([boom, undefined]);
    });

    it("should pass through multiple arguments", () => {
      const result = safely((a: number, b: number, c: number) => a + b + c)(
        1,
        2,
        3,
      );
      expect(result).to.deep.equal([undefined, 6]);
    });

    it("should preserve non-Error throws (string)", () => {
      const result = safely(() => {
        throw "string error";
      })();
      expect(result).to.deep.equal(["string error", undefined]);
    });

    it("should preserve non-Error throws (null)", () => {
      const result = safely(() => {
        throw null;
      })();
      expect(result).to.deep.equal([null, undefined]);
    });

    it("should work with JSON.parse on valid input", () => {
      const result = safely(JSON.parse)('{"a":1}');
      expect(result[0]).to.equal(undefined);
      expect(result[1]).to.deep.equal({ a: 1 });
    });

    it("should work with JSON.parse on invalid input", () => {
      const [err, value] = safely(JSON.parse)("{bad");
      expect(err).to.be.instanceOf(SyntaxError);
      expect(value).to.equal(undefined);
    });

    it("should preserve undefined return value", () => {
      const result = safely(() => undefined)();
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should preserve null return value", () => {
      const result = safely(() => null)();
      expect(result).to.deep.equal([undefined, null]);
    });
  });

  describe("async functions", () => {
    it("should resolve to [undefined, value] when promise resolves", async () => {
      const result = await safely(async (x: number) => x + 1)(41);
      expect(result).to.deep.equal([undefined, 42]);
    });

    it("should resolve to [error, undefined] when promise rejects", async () => {
      const boom = new Error("async boom");
      const result = await safely(async () => {
        throw boom;
      })();
      expect(result).to.deep.equal([boom, undefined]);
    });

    it("should resolve to [error, undefined] for explicit Promise.reject", async () => {
      const boom = new Error("rejected");
      const result = await safely(() => Promise.reject(boom))();
      expect(result).to.deep.equal([boom, undefined]);
    });

    it("should pass through arguments to async fn", async () => {
      const result = await safely(async (a: string, b: string) => a + b)(
        "hello ",
        "world",
      );
      expect(result).to.deep.equal([undefined, "hello world"]);
    });

    it("should treat custom thenable as async", async () => {
      const thenable = {
        // biome-ignore lint/suspicious/noThenProperty: intentionally testing thenable detection
        then(resolve: (v: number) => void) {
          resolve(7);
        },
      };
      const result = await safely(
        () => thenable as unknown as Promise<number>,
      )();
      expect(result).to.deep.equal([undefined, 7]);
    });

    it("should preserve non-Error rejection (string)", async () => {
      const result = await safely(async () => {
        throw "rejected string";
      })();
      expect(result).to.deep.equal(["rejected string", undefined]);
    });
  });

  describe("input validation", () => {
    it("should throw if fn is not a function (number)", () => {
      // @ts-expect-error - testing invalid input
      expect(() => safely(42)).to.throw(
        "The 'fn' parameter must be a function",
      );
    });

    it("should throw if fn is undefined", () => {
      // @ts-expect-error - testing invalid input
      expect(() => safely(undefined)).to.throw(
        "The 'fn' parameter must be a function",
      );
    });

    it("should throw if fn is null", () => {
      // @ts-expect-error - testing invalid input
      expect(() => safely(null)).to.throw(
        "The 'fn' parameter must be a function",
      );
    });
  });

  describe("reusability", () => {
    it("should produce a wrapper that can be called multiple times", () => {
      const safeDouble = safely((x: number) => x * 2);
      expect(safeDouble(2)).to.deep.equal([undefined, 4]);
      expect(safeDouble(5)).to.deep.equal([undefined, 10]);
    });

    it("should produce an independent async wrapper across calls", async () => {
      const safeFetch = safely(async (id: number) => {
        if (id < 0) throw new Error("negative");
        return id;
      });
      const [err1, val1] = await safeFetch(-1);
      expect(err1).to.be.instanceOf(Error);
      expect(val1).to.equal(undefined);
      const [err2, val2] = await safeFetch(3);
      expect(err2).to.equal(undefined);
      expect(val2).to.equal(3);
    });
  });
});
