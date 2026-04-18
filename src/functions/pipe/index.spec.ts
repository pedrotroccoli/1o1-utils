import { expect } from "chai";
import { describe, it } from "mocha";
import { pipe } from "./index.js";

describe("pipe", () => {
  it("should compose functions left-to-right", () => {
    const slug = pipe(
      (x: string) => x.trim(),
      (x: string) => x.toLowerCase(),
      (x: string) => x.replace(/\s+/g, "-"),
    );

    expect(slug("  Hello World  ")).to.equal("hello-world");
  });

  it("should pass multiple args to the first function only", () => {
    const composed = pipe(
      (a: number, b: number) => a + b,
      (n: number) => n * 2,
      (n: number) => `result:${n}`,
    );

    expect(composed(2, 3)).to.equal("result:10");
  });

  it("should behave as identity when called with no functions", () => {
    const identity = pipe();

    expect(identity(42)).to.equal(42);
    expect(identity("hello")).to.equal("hello");

    const obj = { a: 1 };
    expect(identity(obj)).to.equal(obj);
  });

  it("should return the single function when called with one function", () => {
    const double = pipe((n: number) => n * 2);

    expect(double(5)).to.equal(10);
  });

  it("should forward all args to a single composed function", () => {
    const sum = pipe((a: number, b: number, c: number) => a + b + c);

    expect(sum(1, 2, 3)).to.equal(6);
  });

  it("should work with two functions", () => {
    const composed = pipe(
      (x: number) => x + 1,
      (x: number) => x * 2,
    );

    expect(composed(3)).to.equal(8);
  });

  it("should preserve types across the chain", () => {
    const length = pipe(
      (x: string) => x.trim(),
      (x: string) => x.split(""),
      (chars: string[]) => chars.length,
    );

    const result: number = length("  abc  ");
    expect(result).to.equal(3);
  });

  it("should throw if any argument is not a function", () => {
    expect(() =>
      pipe(
        (x: number) => x + 1,
        // @ts-expect-error - we want to test the error case
        "not a function",
      ),
    ).to.throw("All 'fns' parameters must be functions");
  });

  it("should throw if the first argument is not a function", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      pipe(42, (x: number) => x + 1),
    ).to.throw("All 'fns' parameters must be functions");
  });

  it("should throw if an argument is undefined", () => {
    expect(() =>
      pipe(
        (x: number) => x + 1,
        // @ts-expect-error - we want to test the error case
        undefined,
      ),
    ).to.throw("All 'fns' parameters must be functions");
  });

  it("should propagate exceptions thrown by composed functions", () => {
    const failing = pipe(
      (x: number) => x + 1,
      () => {
        throw new Error("boom");
      },
      (x: number) => x * 2,
    );

    expect(() => failing(1)).to.throw("boom");
  });

  it("should forward `this` to the first function", () => {
    const obj = {
      value: 42,
      compute: pipe(
        function (this: { value: number }) {
          return this.value;
        },
        (n: number) => n * 2,
      ),
    };

    expect(obj.compute()).to.equal(84);
  });

  it("should not forward the caller's `this` to subsequent stages", () => {
    let receivedThis: unknown = "not called";
    const composed = pipe(
      (x: number) => x + 1,
      function (this: unknown, x: number) {
        receivedThis = this;
        return x * 2;
      },
    );

    const callerCtx = { marker: "caller-ctx" };
    composed.call(callerCtx, 5);

    expect(receivedThis).to.not.equal(callerCtx);
  });

  it("should not mutate the input array of functions", () => {
    const fns = [
      (x: number) => x + 1,
      (x: number) => x * 2,
      (x: number) => x - 3,
    ] as const;
    const composed = pipe(...fns);

    composed(5);

    expect(fns.length).to.equal(3);
  });
});
