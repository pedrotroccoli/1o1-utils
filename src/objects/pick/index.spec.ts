import { expect } from "chai";
import { describe, it } from "mocha";
import { pick } from "./index.js";

describe("pick", () => {
  it("should pick specified keys from an object", () => {
    const result = pick({
      obj: { id: 1, name: "Ana", age: 30 },
      keys: ["id", "name"],
    });

    expect(result).to.deep.equal({ id: 1, name: "Ana" });
  });

  it("should return an empty object when keys is empty", () => {
    const result = pick({
      obj: { id: 1, name: "Ana" },
      keys: [],
    });

    expect(result).to.deep.equal({});
  });

  it("should return all properties when all keys are specified", () => {
    const result = pick({
      obj: { id: 1, name: "Ana" },
      keys: ["id", "name"],
    });

    expect(result).to.deep.equal({ id: 1, name: "Ana" });
  });

  it("should ignore keys that do not exist in the object", () => {
    const result = pick({
      obj: { id: 1, name: "Ana" },
      keys: ["id", "email"],
    });

    expect(result).to.deep.equal({ id: 1 });
  });

  it("should return a new object, not a reference to the original", () => {
    const obj = { id: 1, name: "Ana" };
    const result = pick({ obj, keys: ["id", "name"] });

    expect(result).to.not.equal(obj);
  });

  it("should pick nested keys using dot notation", () => {
    const result = pick({
      obj: { user: { name: "Ana", age: 30 }, id: 1 },
      keys: ["user.name", "id"],
    });

    expect(result).to.deep.equal({ user: { name: "Ana" }, id: 1 });
  });

  it("should pick deeply nested keys", () => {
    const result = pick({
      obj: { a: { b: { c: 1, d: 2 }, e: 3 } },
      keys: ["a.b.c"],
    });

    expect(result).to.deep.equal({ a: { b: { c: 1 } } });
  });

  it("should merge multiple nested keys under the same parent", () => {
    const result = pick({
      obj: { user: { name: "Ana", age: 30, email: "ana@test.com" } },
      keys: ["user.name", "user.email"],
    });

    expect(result).to.deep.equal({
      user: { name: "Ana", email: "ana@test.com" },
    });
  });

  it("should ignore nested keys that do not exist", () => {
    const result = pick({
      obj: { user: { name: "Ana" } },
      keys: ["user.email"],
    });

    expect(result).to.deep.equal({});
  });

  it("should ignore nested keys when intermediate path is not an object", () => {
    const result = pick({
      obj: { user: "not an object" },
      keys: ["user.name"],
    });

    expect(result).to.deep.equal({});
  });

  it("should throw an error if obj is not an object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => pick({ obj: "not an object", keys: ["id"] })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw an error if obj is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => pick({ obj: null, keys: ["id"] })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw an error if keys is not an array", () => {
    // @ts-expect-error - testing invalid input
    expect(() => pick({ obj: { id: 1 }, keys: "id" })).to.throw(
      "The 'keys' parameter is not an array",
    );
  });
});
