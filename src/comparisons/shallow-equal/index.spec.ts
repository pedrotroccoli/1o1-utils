import { expect } from "chai";
import { describe, it } from "mocha";
import { shallowEqual } from "./index.js";

describe("shallowEqual", () => {
  describe("primitives", () => {
    it("should return true for identical primitives", () => {
      expect(shallowEqual({ a: 1, b: 1 })).to.equal(true);
      expect(shallowEqual({ a: "foo", b: "foo" })).to.equal(true);
      expect(shallowEqual({ a: true, b: true })).to.equal(true);
    });

    it("should return false for different primitives", () => {
      expect(shallowEqual({ a: 1, b: 2 })).to.equal(false);
      expect(shallowEqual({ a: "foo", b: "bar" })).to.equal(false);
      expect(shallowEqual({ a: true, b: false })).to.equal(false);
    });

    it("should treat NaN as equal to NaN", () => {
      expect(shallowEqual({ a: Number.NaN, b: Number.NaN })).to.equal(true);
    });

    it("should treat +0 and -0 as not equal", () => {
      expect(shallowEqual({ a: 0, b: -0 })).to.equal(false);
    });

    it("should return true for identical null/undefined", () => {
      expect(shallowEqual({ a: null, b: null })).to.equal(true);
      expect(shallowEqual({ a: undefined, b: undefined })).to.equal(true);
    });

    it("should return false for null vs undefined", () => {
      expect(shallowEqual({ a: null, b: undefined })).to.equal(false);
    });

    it("should return false when comparing a primitive to an object", () => {
      expect(shallowEqual({ a: 1, b: { 0: 1 } })).to.equal(false);
      expect(shallowEqual({ a: null, b: {} })).to.equal(false);
    });
  });

  describe("same reference", () => {
    it("should return true when both values are the same reference", () => {
      const obj = { x: 1 };
      expect(shallowEqual({ a: obj, b: obj })).to.equal(true);

      const arr = [1, 2, 3];
      expect(shallowEqual({ a: arr, b: arr })).to.equal(true);
    });
  });

  describe("objects", () => {
    it("should return true for objects with the same shallow entries", () => {
      expect(shallowEqual({ a: { x: 1, y: 2 }, b: { x: 1, y: 2 } })).to.equal(
        true,
      );
    });

    it("should return false when values differ", () => {
      expect(shallowEqual({ a: { x: 1, y: 2 }, b: { x: 1, y: 3 } })).to.equal(
        false,
      );
    });

    it("should return false when key sets differ in size", () => {
      expect(shallowEqual({ a: { x: 1 }, b: { x: 1, y: 2 } })).to.equal(false);
    });

    it("should return false when key sets have same size but different keys", () => {
      expect(shallowEqual({ a: { x: 1, y: 2 }, b: { x: 1, z: 2 } })).to.equal(
        false,
      );
    });

    it("should compare nested values by reference, not structurally", () => {
      expect(shallowEqual({ a: { n: { v: 1 } }, b: { n: { v: 1 } } })).to.equal(
        false,
      );

      const shared = { v: 1 };
      expect(shallowEqual({ a: { n: shared }, b: { n: shared } })).to.equal(
        true,
      );
    });

    it("should handle empty objects", () => {
      expect(shallowEqual({ a: {}, b: {} })).to.equal(true);
    });

    it("should ignore key order", () => {
      expect(shallowEqual({ a: { x: 1, y: 2 }, b: { y: 2, x: 1 } })).to.equal(
        true,
      );
    });
  });

  describe("arrays", () => {
    it("should return true for arrays with the same items", () => {
      expect(shallowEqual({ a: [1, 2, 3], b: [1, 2, 3] })).to.equal(true);
    });

    it("should return false when array lengths differ", () => {
      expect(shallowEqual({ a: [1, 2], b: [1, 2, 3] })).to.equal(false);
    });

    it("should return false when array items differ", () => {
      expect(shallowEqual({ a: [1, 2, 3], b: [1, 2, 4] })).to.equal(false);
    });

    it("should return false when array order differs", () => {
      expect(shallowEqual({ a: [1, 2, 3], b: [3, 2, 1] })).to.equal(false);
    });

    it("should compare nested arrays by reference", () => {
      expect(shallowEqual({ a: [[1], [2]], b: [[1], [2]] })).to.equal(false);
    });

    it("should handle empty arrays", () => {
      expect(shallowEqual({ a: [], b: [] })).to.equal(true);
    });

    it("should return false when comparing array to object with matching keys", () => {
      expect(
        shallowEqual({ a: [1, 2], b: { 0: 1, 1: 2, length: 2 } }),
      ).to.equal(false);
    });
  });

  describe("built-ins", () => {
    it("should fall back to reference equality for Dates", () => {
      const d = new Date("2024-01-01");
      expect(shallowEqual({ a: d, b: d })).to.equal(true);
      expect(
        shallowEqual({ a: new Date("2024-01-01"), b: new Date("2024-01-01") }),
      ).to.equal(false);
    });

    it("should fall back to reference equality for Maps", () => {
      const m = new Map([["x", 1]]);
      expect(shallowEqual({ a: m, b: m })).to.equal(true);
      expect(
        shallowEqual({ a: new Map([["x", 1]]), b: new Map([["x", 1]]) }),
      ).to.equal(false);
    });
  });
});
