import { expect } from "chai";
import { describe, it } from "mocha";
import { cloneDeep } from "./index.js";

describe("cloneDeep", () => {
  // --- Primitives (pass-through) ---

  it("should return numbers as-is", () => {
    expect(cloneDeep({ value: 42 })).to.equal(42);
    expect(cloneDeep({ value: 0 })).to.equal(0);
    expect(cloneDeep({ value: -1 })).to.equal(-1);
    expect(cloneDeep({ value: Number.POSITIVE_INFINITY })).to.equal(
      Number.POSITIVE_INFINITY,
    );
  });

  it("should return strings as-is", () => {
    expect(cloneDeep({ value: "hello" })).to.equal("hello");
    expect(cloneDeep({ value: "" })).to.equal("");
  });

  it("should return booleans as-is", () => {
    expect(cloneDeep({ value: true })).to.equal(true);
    expect(cloneDeep({ value: false })).to.equal(false);
  });

  it("should return null as-is", () => {
    expect(cloneDeep({ value: null })).to.equal(null);
  });

  it("should return undefined as-is", () => {
    expect(cloneDeep({ value: undefined })).to.equal(undefined);
  });

  it("should return symbols as-is", () => {
    const sym = Symbol.for("test");
    expect(cloneDeep({ value: sym })).to.equal(sym);
  });

  it("should return bigints as-is", () => {
    expect(cloneDeep({ value: BigInt(42) })).to.equal(BigInt(42));
  });

  // --- Plain objects ---

  it("should clone a shallow object", () => {
    const original = { a: 1, b: "hello", c: true };
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned).to.not.equal(original);
  });

  it("should clone a nested object", () => {
    const original = { a: { b: { c: 1 } } };
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned.a).to.not.equal(original.a);
    expect(cloned.a.b).to.not.equal(original.a.b);
  });

  it("should clone an empty object", () => {
    const cloned = cloneDeep({ value: {} });
    expect(cloned).to.deep.equal({});
  });

  it("should not mutate original when clone is modified", () => {
    const original = { a: { b: [1, 2] } };
    const cloned = cloneDeep({ value: original });

    cloned.a.b.push(3);
    expect(original.a.b).to.deep.equal([1, 2]);
  });

  it("should clone objects with null prototype", () => {
    const original = Object.create(null) as Record<string, unknown>;
    original.a = 1;
    original.b = "hello";

    const cloned = cloneDeep({ value: original }) as Record<string, unknown>;

    expect(Object.getPrototypeOf(cloned)).to.equal(null);
    expect(cloned.a).to.equal(1);
    expect(cloned.b).to.equal("hello");
  });

  // --- Arrays ---

  it("should clone a simple array", () => {
    const original = [1, 2, 3];
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned).to.not.equal(original);
  });

  it("should clone an array of objects", () => {
    const original = [{ a: 1 }, { b: 2 }];
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned[0]).to.not.equal(original[0]);
    expect(cloned[1]).to.not.equal(original[1]);
  });

  it("should clone nested arrays", () => {
    const original = [
      [1, 2],
      [3, [4, 5]],
    ];
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned[1]).to.not.equal(original[1]);
  });

  it("should preserve sparse arrays", () => {
    // biome-ignore lint/suspicious/noSparseArray: testing sparse arrays
    const original = [1, , 3];
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.have.length(3);
    expect(0 in cloned).to.be.true;
    expect(1 in cloned).to.be.false;
    expect(2 in cloned).to.be.true;
  });

  // --- Date ---

  it("should clone a Date", () => {
    const original = new Date("2024-01-15T10:30:00Z");
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Date);
    expect(cloned.getTime()).to.equal(original.getTime());
    expect(cloned).to.not.equal(original);
  });

  it("should not affect original when cloned Date is mutated", () => {
    const original = new Date("2024-01-15");
    const cloned = cloneDeep({ value: original });

    cloned.setFullYear(2000);
    expect(original.getFullYear()).to.equal(2024);
  });

  // --- RegExp ---

  it("should clone a RegExp", () => {
    const original = /foo/gi;
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(RegExp);
    expect(cloned.source).to.equal("foo");
    expect(cloned.flags).to.equal("gi");
    expect(cloned).to.not.equal(original);
  });

  // --- Map ---

  it("should clone a Map", () => {
    const original = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Map);
    expect(cloned.size).to.equal(2);
    expect(cloned.get("a")).to.equal(1);
    expect(cloned).to.not.equal(original);
  });

  it("should deep clone Map object values", () => {
    const inner = { x: 1 };
    const original = new Map([["key", inner]]);
    const cloned = cloneDeep({ value: original });

    expect(cloned.get("key")).to.deep.equal(inner);
    expect(cloned.get("key")).to.not.equal(inner);
  });

  it("should keep Map object keys by reference", () => {
    const key = { id: 1 };
    const original = new Map([[key, "value"]]);
    const cloned = cloneDeep({ value: original });

    expect(cloned.has(key)).to.be.true;
  });

  // --- Set ---

  it("should clone a Set", () => {
    const original = new Set([1, 2, 3]);
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Set);
    expect(cloned.size).to.equal(3);
    expect(cloned).to.not.equal(original);
  });

  it("should deep clone Set object values", () => {
    const obj = { a: 1 };
    const original = new Set([obj]);
    const cloned = cloneDeep({ value: original });

    const clonedObj = [...cloned][0];
    expect(clonedObj).to.deep.equal(obj);
    expect(clonedObj).to.not.equal(obj);
  });

  // --- TypedArrays ---

  it("should clone a Uint8Array", () => {
    const original = new Uint8Array([1, 2, 3]);
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Uint8Array);
    expect([...cloned]).to.deep.equal([1, 2, 3]);
    expect(cloned.buffer).to.not.equal(original.buffer);
  });

  it("should clone a Float64Array", () => {
    const original = new Float64Array([1.1, 2.2]);
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Float64Array);
    expect([...cloned]).to.deep.equal([1.1, 2.2]);
    expect(cloned.buffer).to.not.equal(original.buffer);
  });

  it("should not affect original when cloned TypedArray is modified", () => {
    const original = new Uint8Array([10, 20, 30]);
    const cloned = cloneDeep({ value: original });

    cloned[0] = 99;
    expect(original[0]).to.equal(10);
  });

  // --- ArrayBuffer ---

  it("should clone an ArrayBuffer", () => {
    const original = new ArrayBuffer(8);
    const view = new Uint8Array(original);
    view[0] = 42;

    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(ArrayBuffer);
    expect(cloned.byteLength).to.equal(8);
    expect(cloned).to.not.equal(original);
    expect(new Uint8Array(cloned)[0]).to.equal(42);
  });

  // --- Error ---

  it("should clone an Error", () => {
    const original = new Error("test error");
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(Error);
    expect(cloned.message).to.equal("test error");
    expect(cloned.stack).to.equal(original.stack);
    expect(cloned).to.not.equal(original);
  });

  it("should clone Error subclasses", () => {
    const original = new TypeError("bad type");
    const cloned = cloneDeep({ value: original });

    expect(cloned).to.be.instanceOf(TypeError);
    expect(cloned.message).to.equal("bad type");
  });

  it("should clone Error with custom properties", () => {
    const original = new Error("fail");
    (original as Error & { code: number }).code = 404;

    const cloned = cloneDeep({ value: original }) as Error & { code: number };

    expect(cloned.message).to.equal("fail");
    expect(cloned.code).to.equal(404);
  });

  // --- Circular references ---

  it("should handle self-referencing objects", () => {
    const original: Record<string, unknown> = { a: 1 };
    original.self = original;

    const cloned = cloneDeep({ value: original }) as Record<string, unknown>;

    expect(cloned.a).to.equal(1);
    expect(cloned.self).to.equal(cloned);
    expect(cloned.self).to.not.equal(original);
  });

  it("should handle mutually referencing objects", () => {
    const a: Record<string, unknown> = { name: "a" };
    const b: Record<string, unknown> = { name: "b" };
    a.ref = b;
    b.ref = a;

    const cloned = cloneDeep({ value: a }) as Record<string, unknown>;
    const clonedB = cloned.ref as Record<string, unknown>;

    expect(cloned.name).to.equal("a");
    expect(clonedB.name).to.equal("b");
    expect(clonedB.ref).to.equal(cloned);
    expect(clonedB).to.not.equal(b);
  });

  it("should handle arrays containing themselves", () => {
    const original: unknown[] = [1, 2];
    original.push(original);

    const cloned = cloneDeep({ value: original }) as unknown[];

    expect(cloned[0]).to.equal(1);
    expect(cloned[1]).to.equal(2);
    expect(cloned[2]).to.equal(cloned);
    expect(cloned[2]).to.not.equal(original);
  });

  it("should handle nested circular references", () => {
    const original: Record<string, unknown> = {
      child: { value: 1 } as Record<string, unknown>,
    };
    (original.child as Record<string, unknown>).parent = original;

    const cloned = cloneDeep({ value: original }) as Record<string, unknown>;
    const clonedChild = cloned.child as Record<string, unknown>;

    expect(clonedChild.value).to.equal(1);
    expect(clonedChild.parent).to.equal(cloned);
  });

  // --- Functions ---

  it("should copy functions by reference", () => {
    const fn = () => 42;
    const original = { callback: fn };
    const cloned = cloneDeep({ value: original });

    expect(cloned.callback).to.equal(fn);
  });

  // --- Deep nesting (stack overflow protection) ---

  it("should handle deeply nested structures without stack overflow", () => {
    let original: Record<string, unknown> = { value: "leaf" };
    for (let i = 0; i < 10_000; i++) {
      original = { child: original };
    }

    const cloned = cloneDeep({ value: original });

    let node = cloned as Record<string, unknown>;
    for (let i = 0; i < 10_000; i++) {
      node = node.child as Record<string, unknown>;
    }
    expect(node.value).to.equal("leaf");
  });

  // --- Mixed structures ---

  it("should clone a complex mixed structure", () => {
    const original = {
      name: "test",
      tags: [1, "two", { three: 3 }],
      date: new Date("2024-06-01"),
      pattern: /abc/i,
      metadata: new Map<string, unknown>([["key", { nested: true }]]),
      ids: new Set([1, 2, 3]),
      buffer: new Uint8Array([10, 20]),
      nested: {
        deep: {
          value: 42,
        },
      },
    };

    const cloned = cloneDeep({ value: original });

    expect(cloned).to.deep.equal(original);
    expect(cloned).to.not.equal(original);
    expect(cloned.tags).to.not.equal(original.tags);
    expect(cloned.tags[2]).to.not.equal(original.tags[2]);
    expect(cloned.date).to.not.equal(original.date);
    expect(cloned.pattern).to.not.equal(original.pattern);
    expect(cloned.metadata).to.not.equal(original.metadata);
    expect(cloned.ids).to.not.equal(original.ids);
    expect(cloned.buffer).to.not.equal(original.buffer);
    expect(cloned.nested.deep).to.not.equal(original.nested.deep);
  });
});
