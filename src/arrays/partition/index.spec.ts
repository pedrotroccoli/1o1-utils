import { expect } from "chai";
import { describe, it } from "mocha";
import { partition } from "./index.js";

describe("partition", () => {
  it("should split numbers into evens and odds", () => {
    expect(
      partition({ array: [1, 2, 3, 4, 5], predicate: (n) => n % 2 === 0 }),
    ).to.deep.equal([
      [2, 4],
      [1, 3, 5],
    ]);
  });

  it("should split objects by predicate", () => {
    const users = [
      { name: "Alice", isActive: true },
      { name: "Bob", isActive: false },
      { name: "Carol", isActive: true },
    ];
    const [active, inactive] = partition({
      array: users,
      predicate: (u) => u.isActive,
    });
    expect(active).to.deep.equal([
      { name: "Alice", isActive: true },
      { name: "Carol", isActive: true },
    ]);
    expect(inactive).to.deep.equal([{ name: "Bob", isActive: false }]);
  });

  it("should return all items in the first group when predicate is always true", () => {
    expect(
      partition({ array: [1, 2, 3], predicate: () => true }),
    ).to.deep.equal([[1, 2, 3], []]);
  });

  it("should return all items in the second group when predicate is always false", () => {
    expect(
      partition({ array: [1, 2, 3], predicate: () => false }),
    ).to.deep.equal([[], [1, 2, 3]]);
  });

  it("should return two empty arrays for an empty input", () => {
    expect(partition({ array: [], predicate: () => true })).to.deep.equal([
      [],
      [],
    ]);
  });

  it("should preserve insertion order within each group", () => {
    expect(
      partition({
        array: [3, 1, 4, 1, 5, 9, 2, 6],
        predicate: (n) => n > 3,
      }),
    ).to.deep.equal([
      [4, 5, 9, 6],
      [3, 1, 1, 2],
    ]);
  });

  it("should pass index as the second argument to the predicate", () => {
    const seen: Array<[unknown, number]> = [];
    partition({
      array: ["a", "b", "c"],
      predicate: (item, index) => {
        seen.push([item, index]);
        return index % 2 === 0;
      },
    });
    expect(seen).to.deep.equal([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  it("should partition by index using the second predicate argument", () => {
    expect(
      partition({
        array: ["a", "b", "c", "d"],
        predicate: (_, i) => i % 2 === 0,
      }),
    ).to.deep.equal([
      ["a", "c"],
      ["b", "d"],
    ]);
  });

  it("should not mutate the input array", () => {
    const input = [1, 2, 3, 4];
    const snapshot = [...input];
    partition({ array: input, predicate: (n) => n > 2 });
    expect(input).to.deep.equal(snapshot);
  });

  it("should treat truthy non-boolean predicate returns as matches", () => {
    expect(
      partition({
        array: [0, 1, 2, 0, 3],
        predicate: (n) => n as unknown as boolean,
      }),
    ).to.deep.equal([
      [1, 2, 3],
      [0, 0],
    ]);
  });

  it("should narrow types via a type-guard predicate", () => {
    type A = { kind: "a"; a: number };
    type B = { kind: "b"; b: string };
    const items: Array<A | B> = [
      { kind: "a", a: 1 },
      { kind: "b", b: "x" },
      { kind: "a", a: 2 },
    ];
    const [as, bs] = partition({
      array: items,
      predicate: (x): x is A => x.kind === "a",
    });
    expect(as).to.deep.equal([
      { kind: "a", a: 1 },
      { kind: "a", a: 2 },
    ]);
    expect(bs).to.deep.equal([{ kind: "b", b: "x" }]);
    // Type-level: confirm narrowing compiles.
    const firstA: A | undefined = as[0];
    const firstB: B | undefined = bs[0];
    expect(firstA?.kind).to.equal("a");
    expect(firstB?.kind).to.equal("b");
  });

  it("should throw an error if array is not an array", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      partition({ array: "abc", predicate: () => true }),
    ).to.throw("The 'array' parameter is not an array");
  });

  it("should throw an error if array is null", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      partition({ array: null, predicate: () => true }),
    ).to.throw("The 'array' parameter is not an array");
  });

  it("should throw an error if predicate is not a function", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      partition({ array: [1, 2, 3], predicate: "nope" }),
    ).to.throw("The 'predicate' parameter must be a function");
  });

  it("should throw an error if predicate is undefined", () => {
    expect(() =>
      // @ts-expect-error - we want to test the error case
      partition({ array: [1, 2, 3] }),
    ).to.throw("The 'predicate' parameter must be a function");
  });
});
