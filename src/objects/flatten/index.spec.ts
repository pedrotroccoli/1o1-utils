import { expect } from "chai";
import { describe, it } from "mocha";
import { flatten } from "./index.js";

describe("flatten", () => {
  describe("arrays", () => {
    it("should deep flatten by default", () => {
      const result = flatten({ value: [1, [2, [3, [4]]]] });
      expect(result).to.deep.equal([1, 2, 3, 4]);
    });

    it("should respect depth = 1", () => {
      const result = flatten({ value: [1, [2, [3]]], depth: 1 });
      expect(result).to.deep.equal([1, 2, [3]]);
    });

    it("should respect depth = 0 (no flattening)", () => {
      const result = flatten({ value: [1, [2, [3]]], depth: 0 });
      expect(result).to.deep.equal([1, [2, [3]]]);
    });

    it("should handle empty arrays", () => {
      const result = flatten({ value: [] });
      expect(result).to.deep.equal([]);
    });

    it("should preserve array of objects as leaves", () => {
      const a = { id: 1 };
      const b = { id: 2 };
      const result = flatten({ value: [a, [b]] });
      expect(result).to.deep.equal([a, b]);
    });

    it("should not mutate the input array", () => {
      const input = [1, [2, [3]]];
      const snapshot = JSON.parse(JSON.stringify(input));
      flatten({ value: input });
      expect(input).to.deep.equal(snapshot);
    });

    it("should handle mixed types", () => {
      const result = flatten({
        value: [1, "a", [true, [null, [undefined]]]],
      });
      expect(result).to.deep.equal([1, "a", true, null, undefined]);
    });
  });

  describe("objects", () => {
    it("should flatten a nested object to dot-notation keys", () => {
      const result = flatten({
        value: { a: { b: 1, c: { d: 2 } }, e: 3 },
      });
      expect(result).to.deep.equal({ "a.b": 1, "a.c.d": 2, e: 3 });
    });

    it("should return an empty object for empty input", () => {
      const result = flatten({ value: {} });
      expect(result).to.deep.equal({});
    });

    it("should preserve arrays as leaves", () => {
      const result = flatten({
        value: { a: [1, 2, 3], b: { c: [4, 5] } },
      });
      expect(result).to.deep.equal({ a: [1, 2, 3], "b.c": [4, 5] });
    });

    it("should preserve Date instances as leaves", () => {
      const date = new Date("2024-01-01");
      const result = flatten({ value: { a: { b: date } } });
      expect(result).to.deep.equal({ "a.b": date });
    });

    it("should preserve null values", () => {
      const result = flatten({ value: { a: { b: null } } });
      expect(result).to.deep.equal({ "a.b": null });
    });

    it("should preserve undefined values", () => {
      const result = flatten({ value: { a: { b: undefined } } });
      expect(result).to.deep.equal({ "a.b": undefined });
    });

    it("should preserve empty nested objects as `{}` leaves", () => {
      const result = flatten({ value: { a: {}, b: { c: {} } } });
      expect(result).to.deep.equal({ a: {}, "b.c": {} });
    });

    it("should not descend into class instances", () => {
      class Foo {
        x = 1;
      }
      const foo = new Foo();
      const result = flatten({ value: { a: foo } });
      expect(result).to.deep.equal({ a: foo });
    });

    it("should ignore unsafe keys", () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": true}}');
      const result = flatten({ value: malicious });
      expect(result).to.deep.equal({});
      expect(({} as Record<string, unknown>).polluted).to.equal(undefined);
    });

    it("should ignore nested unsafe key segments", () => {
      const malicious = JSON.parse(
        '{"a": {"__proto__": {"polluted": true}, "b": 1}}',
      );
      const result = flatten({ value: malicious });
      expect(result).to.deep.equal({ "a.b": 1 });
    });

    it("should descend into Object.create(null) prototype-less objects", () => {
      const inner = Object.create(null) as Record<string, unknown>;
      inner.x = 1;
      const result = flatten({ value: { a: inner } });
      expect(result).to.deep.equal({ "a.x": 1 });
    });

    it("should throw on direct circular reference", () => {
      const o: Record<string, unknown> = {};
      o.self = o;
      expect(() => flatten({ value: o })).to.throw(
        "Circular reference detected while flattening object",
      );
    });

    it("should throw on indirect circular reference", () => {
      const a: Record<string, unknown> = {};
      const b: Record<string, unknown> = { a };
      a.b = b;
      expect(() => flatten({ value: a })).to.throw(
        "Circular reference detected while flattening object",
      );
    });

    it("should share leaf references with the input (no deep clone)", () => {
      const arr = [1, 2, 3];
      const result = flatten({ value: { a: { b: arr } } }) as Record<
        string,
        unknown
      >;
      expect(result["a.b"]).to.equal(arr);
    });

    it("should not mutate the input object", () => {
      const input = { a: { b: 1 }, c: 2 };
      const snapshot = JSON.parse(JSON.stringify(input));
      flatten({ value: input });
      expect(input).to.deep.equal(snapshot);
    });

    it("should return a new object reference", () => {
      const input = { a: 1 };
      const result = flatten({ value: input });
      expect(result).to.not.equal(input);
    });

    it("should handle deeply nested objects", () => {
      const result = flatten({
        value: { a: { b: { c: { d: { e: { f: 1 } } } } } },
      });
      expect(result).to.deep.equal({ "a.b.c.d.e.f": 1 });
    });
  });

  describe("errors", () => {
    it("should throw if value is null", () => {
      expect(() =>
        flatten({ value: null as unknown as Record<string, unknown> }),
      ).to.throw("The 'value' parameter is not an array or plain object");
    });

    it("should throw if value is a string", () => {
      expect(() =>
        flatten({ value: "abc" as unknown as Record<string, unknown> }),
      ).to.throw("The 'value' parameter is not an array or plain object");
    });

    it("should throw if value is a number", () => {
      expect(() =>
        flatten({ value: 1 as unknown as Record<string, unknown> }),
      ).to.throw("The 'value' parameter is not an array or plain object");
    });

    it("should throw if value is undefined", () => {
      expect(() =>
        flatten({ value: undefined as unknown as Record<string, unknown> }),
      ).to.throw("The 'value' parameter is not an array or plain object");
    });

    it("should throw if value is a Map", () => {
      expect(() =>
        flatten({ value: new Map() as unknown as Record<string, unknown> }),
      ).to.throw("The 'value' parameter is not an array or plain object");
    });
  });
});
