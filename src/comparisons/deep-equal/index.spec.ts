import { expect } from "chai";
import { describe, it } from "mocha";
import { deepEqual } from "./index.js";

describe("deepEqual", () => {
  describe("primitives", () => {
    it("should return true for identical primitives", () => {
      expect(deepEqual({ a: 1, b: 1 })).to.equal(true);
      expect(deepEqual({ a: "foo", b: "foo" })).to.equal(true);
      expect(deepEqual({ a: true, b: true })).to.equal(true);
    });

    it("should return false for different primitives", () => {
      expect(deepEqual({ a: 1, b: 2 })).to.equal(false);
      expect(deepEqual({ a: "foo", b: "bar" })).to.equal(false);
    });

    it("should treat NaN as equal to NaN", () => {
      expect(deepEqual({ a: Number.NaN, b: Number.NaN })).to.equal(true);
    });

    it("should treat +0 and -0 as not equal", () => {
      expect(deepEqual({ a: 0, b: -0 })).to.equal(false);
    });

    it("should return true for identical null/undefined", () => {
      expect(deepEqual({ a: null, b: null })).to.equal(true);
      expect(deepEqual({ a: undefined, b: undefined })).to.equal(true);
    });

    it("should return false for null vs undefined", () => {
      expect(deepEqual({ a: null, b: undefined })).to.equal(false);
    });

    it("should return false when comparing a primitive to an object", () => {
      expect(deepEqual({ a: 1, b: { 0: 1 } })).to.equal(false);
      expect(deepEqual({ a: null, b: {} })).to.equal(false);
    });
  });

  describe("same reference", () => {
    it("should return true when both values are the same reference", () => {
      const obj = { x: 1 };
      expect(deepEqual({ a: obj, b: obj })).to.equal(true);
    });
  });

  describe("plain objects", () => {
    it("should return true for objects with the same nested entries", () => {
      expect(
        deepEqual({
          a: { x: { n: 1 }, y: [1, 2] },
          b: { x: { n: 1 }, y: [1, 2] },
        }),
      ).to.equal(true);
    });

    it("should return false when nested values differ", () => {
      expect(deepEqual({ a: { x: { n: 1 } }, b: { x: { n: 2 } } })).to.equal(
        false,
      );
    });

    it("should return false when key sets differ in size", () => {
      expect(deepEqual({ a: { x: 1 }, b: { x: 1, y: 2 } })).to.equal(false);
    });

    it("should return false when key sets have same size but different keys", () => {
      expect(deepEqual({ a: { x: 1, y: 2 }, b: { x: 1, z: 2 } })).to.equal(
        false,
      );
    });

    it("should ignore key order", () => {
      expect(deepEqual({ a: { x: 1, y: 2 }, b: { y: 2, x: 1 } })).to.equal(
        true,
      );
    });

    it("should handle empty objects", () => {
      expect(deepEqual({ a: {}, b: {} })).to.equal(true);
    });

    it("should handle null-prototype objects", () => {
      const a = Object.create(null);
      a.x = 1;
      const b = Object.create(null);
      b.x = 1;
      expect(deepEqual({ a, b })).to.equal(true);
    });

    it("should return false when prototypes differ", () => {
      class Foo {
        x = 1;
      }
      class Bar {
        x = 1;
      }
      expect(deepEqual({ a: new Foo(), b: new Bar() })).to.equal(false);
    });

    it("should compare same-prototype class instances structurally", () => {
      class Point {
        constructor(
          public x: number,
          public y: number,
        ) {}
      }
      expect(deepEqual({ a: new Point(1, 2), b: new Point(1, 2) })).to.equal(
        true,
      );
      expect(deepEqual({ a: new Point(1, 2), b: new Point(1, 3) })).to.equal(
        false,
      );
    });
  });

  describe("arrays", () => {
    it("should return true for arrays with the same items", () => {
      expect(deepEqual({ a: [1, 2, 3], b: [1, 2, 3] })).to.equal(true);
    });

    it("should compare nested arrays structurally", () => {
      expect(deepEqual({ a: [[1], [2]], b: [[1], [2]] })).to.equal(true);
    });

    it("should return false when array lengths differ", () => {
      expect(deepEqual({ a: [1, 2], b: [1, 2, 3] })).to.equal(false);
    });

    it("should return false when array order differs", () => {
      expect(deepEqual({ a: [1, 2, 3], b: [3, 2, 1] })).to.equal(false);
    });

    it("should handle empty arrays", () => {
      expect(deepEqual({ a: [], b: [] })).to.equal(true);
    });

    it("should return false when comparing array to plain object", () => {
      expect(deepEqual({ a: [1, 2], b: { 0: 1, 1: 2 } })).to.equal(false);
    });
  });

  describe("Date", () => {
    it("should treat dates with the same time as equal", () => {
      expect(
        deepEqual({ a: new Date("2024-01-01"), b: new Date("2024-01-01") }),
      ).to.equal(true);
    });

    it("should return false when dates differ", () => {
      expect(
        deepEqual({ a: new Date("2024-01-01"), b: new Date("2024-01-02") }),
      ).to.equal(false);
    });
  });

  describe("RegExp", () => {
    it("should treat regexes with the same source and flags as equal", () => {
      expect(deepEqual({ a: /foo/gi, b: /foo/gi })).to.equal(true);
    });

    it("should return false when sources differ", () => {
      expect(deepEqual({ a: /foo/g, b: /bar/g })).to.equal(false);
    });

    it("should return false when flags differ", () => {
      expect(deepEqual({ a: /foo/g, b: /foo/i })).to.equal(false);
    });
  });

  describe("Map", () => {
    it("should treat maps with the same entries as equal", () => {
      expect(
        deepEqual({
          a: new Map([
            ["x", 1],
            ["y", 2],
          ]),
          b: new Map([
            ["x", 1],
            ["y", 2],
          ]),
        }),
      ).to.equal(true);
    });

    it("should return false when sizes differ", () => {
      expect(
        deepEqual({
          a: new Map([["x", 1]]),
          b: new Map([
            ["x", 1],
            ["y", 2],
          ]),
        }),
      ).to.equal(false);
    });

    it("should return false when values differ", () => {
      expect(
        deepEqual({ a: new Map([["x", 1]]), b: new Map([["x", 2]]) }),
      ).to.equal(false);
    });

    it("should handle structural object keys", () => {
      expect(
        deepEqual({
          a: new Map<unknown, number>([[{ id: 1 }, 10]]),
          b: new Map<unknown, number>([[{ id: 1 }, 10]]),
        }),
      ).to.equal(true);
    });
  });

  describe("Set", () => {
    it("should treat sets with the same elements as equal", () => {
      expect(
        deepEqual({ a: new Set([1, 2, 3]), b: new Set([3, 2, 1]) }),
      ).to.equal(true);
    });

    it("should return false when sizes differ", () => {
      expect(deepEqual({ a: new Set([1, 2]), b: new Set([1, 2, 3]) })).to.equal(
        false,
      );
    });

    it("should handle structural object elements", () => {
      expect(
        deepEqual({
          a: new Set([{ id: 1 }, { id: 2 }]),
          b: new Set([{ id: 2 }, { id: 1 }]),
        }),
      ).to.equal(true);
    });
  });

  describe("typed arrays + ArrayBuffer", () => {
    it("should compare Uint8Array byte-by-byte", () => {
      expect(
        deepEqual({
          a: new Uint8Array([1, 2, 3]),
          b: new Uint8Array([1, 2, 3]),
        }),
      ).to.equal(true);
      expect(
        deepEqual({
          a: new Uint8Array([1, 2, 3]),
          b: new Uint8Array([1, 2, 4]),
        }),
      ).to.equal(false);
    });

    it("should return false when typed arrays have different types", () => {
      expect(
        deepEqual({
          a: new Uint8Array([1, 2]),
          b: new Int8Array([1, 2]),
        }),
      ).to.equal(false);
    });

    it("should compare ArrayBuffer byte-by-byte", () => {
      const a = new ArrayBuffer(4);
      const b = new ArrayBuffer(4);
      new Uint8Array(a).set([1, 2, 3, 4]);
      new Uint8Array(b).set([1, 2, 3, 4]);
      expect(deepEqual({ a, b })).to.equal(true);
    });
  });

  describe("Error", () => {
    it("should fall back to reference equality for Errors", () => {
      const e = new Error("boom");
      expect(deepEqual({ a: e, b: e })).to.equal(true);
      expect(
        deepEqual({ a: new Error("boom"), b: new Error("boom") }),
      ).to.equal(false);
    });
  });

  describe("circular references", () => {
    it("should handle self-referential objects", () => {
      const a: Record<string, unknown> = { x: 1 };
      a.self = a;
      const b: Record<string, unknown> = { x: 1 };
      b.self = b;
      expect(deepEqual({ a, b })).to.equal(true);
    });

    it("should detect mismatch through a cycle", () => {
      const a: Record<string, unknown> = { x: 1 };
      a.self = a;
      const b: Record<string, unknown> = { x: 2 };
      b.self = b;
      expect(deepEqual({ a, b })).to.equal(false);
    });

    it("should handle mutual references", () => {
      const a1: Record<string, unknown> = { name: "a" };
      const a2: Record<string, unknown> = { name: "b", peer: a1 };
      a1.peer = a2;

      const b1: Record<string, unknown> = { name: "a" };
      const b2: Record<string, unknown> = { name: "b", peer: b1 };
      b1.peer = b2;

      expect(deepEqual({ a: a1, b: b1 })).to.equal(true);
    });
  });

  describe("issue #66 examples", () => {
    it("matches the spec API", () => {
      expect(deepEqual({ a: { a: { b: 1 } }, b: { a: { b: 1 } } })).to.equal(
        true,
      );
      expect(deepEqual({ a: [1, [2, 3]], b: [1, [2, 3]] })).to.equal(true);
      expect(
        deepEqual({
          a: new Date("2024-01-01"),
          b: new Date("2024-01-01"),
        }),
      ).to.equal(true);
      expect(deepEqual({ a: { a: 1 }, b: { a: 2 } })).to.equal(false);
    });
  });
});
