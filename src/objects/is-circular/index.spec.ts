import { expect } from "chai";
import { describe, it } from "mocha";
import { isCircular } from "./index.js";

describe("isCircular", () => {
  it("should return false for null", () => {
    expect(isCircular({ value: null })).to.equal(false);
  });

  it("should return false for undefined", () => {
    expect(isCircular({ value: undefined })).to.equal(false);
  });

  it("should return false for primitives", () => {
    expect(isCircular({ value: 0 })).to.equal(false);
    expect(isCircular({ value: 42 })).to.equal(false);
    expect(isCircular({ value: "" })).to.equal(false);
    expect(isCircular({ value: "hello" })).to.equal(false);
    expect(isCircular({ value: true })).to.equal(false);
    expect(isCircular({ value: false })).to.equal(false);
  });

  it("should return false for a function", () => {
    expect(isCircular({ value: () => {} })).to.equal(false);
  });

  it("should return false for an empty object", () => {
    expect(isCircular({ value: {} })).to.equal(false);
  });

  it("should return false for an empty array", () => {
    expect(isCircular({ value: [] })).to.equal(false);
  });

  it("should return false for a nested non-circular object", () => {
    expect(isCircular({ value: { a: { b: { c: 1 } } } })).to.equal(false);
  });

  it("should return false for a nested non-circular array", () => {
    expect(isCircular({ value: [1, [2, [3, [4]]]] })).to.equal(false);
  });

  it("should return true for a self-referencing object", () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(isCircular({ value: obj })).to.equal(true);
  });

  it("should return true for two-node mutual cycle", () => {
    const a: Record<string, unknown> = {};
    const b: Record<string, unknown> = {};
    a.b = b;
    b.a = a;
    expect(isCircular({ value: a })).to.equal(true);
  });

  it("should return true for a deep cycle", () => {
    const a: Record<string, unknown> = {};
    const b: Record<string, unknown> = {};
    const c: Record<string, unknown> = {};
    const d: Record<string, unknown> = {};
    a.b = b;
    b.c = c;
    c.d = d;
    d.a = a;
    expect(isCircular({ value: a })).to.equal(true);
  });

  it("should return true for an array that contains itself", () => {
    const arr: unknown[] = [1, 2];
    arr.push(arr);
    expect(isCircular({ value: arr })).to.equal(true);
  });

  it("should return false for shared (non-circular) references", () => {
    const shared = { value: 1 };
    expect(isCircular({ value: { x: shared, y: shared } })).to.equal(false);
  });

  it("should return false when the same object appears in sibling branches without forming a cycle", () => {
    const shared = { deep: { x: 1 } };
    const root = { a: shared, b: { ref: shared } };
    expect(isCircular({ value: root })).to.equal(false);
  });

  it("should return true for a Map with a cyclic value", () => {
    const map = new Map<string, unknown>();
    map.set("self", map);
    expect(isCircular({ value: map })).to.equal(true);
  });

  it("should return true for a Map with a cyclic key", () => {
    const map = new Map<unknown, unknown>();
    map.set(map, 1);
    expect(isCircular({ value: map })).to.equal(true);
  });

  it("should return true for a Set containing itself", () => {
    const set = new Set<unknown>();
    set.add(set);
    expect(isCircular({ value: set })).to.equal(true);
  });

  it("should return false for a Date", () => {
    expect(isCircular({ value: new Date() })).to.equal(false);
  });

  it("should return false for a RegExp", () => {
    expect(isCircular({ value: /abc/g })).to.equal(false);
  });

  it("should return false for an Error", () => {
    expect(isCircular({ value: new Error("boom") })).to.equal(false);
  });

  it("should return false for an ArrayBuffer", () => {
    expect(isCircular({ value: new ArrayBuffer(8) })).to.equal(false);
  });

  it("should return false for a typed array", () => {
    expect(isCircular({ value: new Uint8Array([1, 2, 3]) })).to.equal(false);
  });

  it("should detect a cycle reachable through nested arrays and objects", () => {
    const root: Record<string, unknown> = { list: [] };
    const list = root.list as unknown[];
    list.push({ back: root });
    expect(isCircular({ value: root })).to.equal(true);
  });

  it("should return true for a class instance with a self-reference", () => {
    class Node {
      next: Node | null = null;
    }
    const n = new Node();
    n.next = n;
    expect(isCircular({ value: n })).to.equal(true);
  });

  it("should return false for a plain class instance with no cycles", () => {
    class Foo {
      x = 1;
      y = { z: 2 };
    }
    expect(isCircular({ value: new Foo() })).to.equal(false);
  });
});
