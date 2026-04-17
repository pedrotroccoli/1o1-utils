import { expect } from "chai";
import { describe, it } from "mocha";
import { once } from "./index.js";

describe("once", () => {
  it("should call the wrapped function only once", () => {
    let callCount = 0;
    const wrapped = once(() => {
      callCount++;
      return "result";
    });

    wrapped();
    wrapped();
    wrapped();

    expect(callCount).to.equal(1);
  });

  it("should return the cached result on subsequent calls", () => {
    const wrapped = once(() => ({ value: Math.random() }));

    const first = wrapped();
    const second = wrapped();
    const third = wrapped();

    expect(first).to.equal(second);
    expect(second).to.equal(third);
  });

  it("should pass arguments to the wrapped function on the first call", () => {
    let received: number[] = [];
    const wrapped = once((...args: number[]) => {
      received = args;
      return args.reduce((a, b) => a + b, 0);
    });

    const result = wrapped(1, 2, 3);

    expect(received).to.deep.equal([1, 2, 3]);
    expect(result).to.equal(6);
  });

  it("should ignore arguments on subsequent calls", () => {
    const wrapped = once((n: number) => n * 2);

    expect(wrapped(5)).to.equal(10);
    expect(wrapped(10)).to.equal(10);
    expect(wrapped(100)).to.equal(10);
  });

  it("should cache an undefined return value", () => {
    let callCount = 0;
    const wrapped = once(() => {
      callCount++;
      return undefined;
    });

    expect(wrapped()).to.equal(undefined);
    expect(wrapped()).to.equal(undefined);
    expect(callCount).to.equal(1);
  });

  it("should preserve the `this` context from the first call", () => {
    const obj = {
      value: 42,
      getValue: once(function (this: { value: number }) {
        return this.value;
      }),
    };

    expect(obj.getValue()).to.equal(42);
  });

  it("should not retry if fn throws on the first call", () => {
    let callCount = 0;
    const wrapped = once(() => {
      callCount++;
      throw new Error("boom");
    });

    expect(() => wrapped()).to.throw("boom");
    expect(wrapped()).to.equal(undefined);
    expect(wrapped()).to.equal(undefined);
    expect(callCount).to.equal(1);
  });

  it("should throw an error if fn is not a function", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => once("not a function")).to.throw(
      "The 'fn' parameter must be a function",
    );
  });

  it("should throw an error if fn is undefined", () => {
    // @ts-expect-error - we want to test the error case
    expect(() => once(undefined)).to.throw(
      "The 'fn' parameter must be a function",
    );
  });
});
