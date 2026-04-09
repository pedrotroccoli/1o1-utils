import { expect } from "chai";
import { describe, it } from "mocha";
import { omit } from "./index.js";

describe("omit", () => {
  it("should omit specified keys from an object", () => {
    const result = omit({
      obj: { id: 1, name: "Ana", password: "123" },
      keys: ["password"],
    });

    expect(result).to.deep.equal({ id: 1, name: "Ana" });
  });

  it("should return a full copy when keys is empty", () => {
    const result = omit({
      obj: { id: 1, name: "Ana" },
      keys: [],
    });

    expect(result).to.deep.equal({ id: 1, name: "Ana" });
  });

  it("should return an empty object when all keys are omitted", () => {
    const result = omit({
      obj: { id: 1, name: "Ana" },
      keys: ["id", "name"],
    });

    expect(result).to.deep.equal({});
  });

  it("should ignore keys that do not exist in the object", () => {
    const result = omit({
      obj: { id: 1, name: "Ana" },
      keys: ["email"],
    });

    expect(result).to.deep.equal({ id: 1, name: "Ana" });
  });

  it("should return a new object, not a reference to the original", () => {
    const obj = { id: 1, name: "Ana" };
    const result = omit({ obj, keys: ["id"] });

    expect(result).to.not.equal(obj);
  });

  it("should omit nested keys using dot notation", () => {
    const result = omit({
      obj: { user: { name: "Ana", age: 30 }, id: 1 },
      keys: ["user.age"],
    });

    expect(result).to.deep.equal({ user: { name: "Ana" }, id: 1 });
  });

  it("should omit deeply nested keys", () => {
    const result = omit({
      obj: { a: { b: { c: 1, d: 2 }, e: 3 } },
      keys: ["a.b.c"],
    });

    expect(result).to.deep.equal({ a: { b: { d: 2 }, e: 3 } });
  });

  it("should omit multiple nested keys under the same parent", () => {
    const result = omit({
      obj: { user: { name: "Ana", age: 30, email: "ana@test.com" } },
      keys: ["user.age", "user.email"],
    });

    expect(result).to.deep.equal({
      user: { name: "Ana" },
    });
  });

  it("should not mutate nested objects in the original", () => {
    const obj = { user: { name: "Ana", age: 30 } };
    omit({ obj, keys: ["user.age"] });

    expect(obj.user).to.deep.equal({ name: "Ana", age: 30 });
  });

  it("should ignore nested keys that do not exist", () => {
    const result = omit({
      obj: { user: { name: "Ana" } },
      keys: ["user.email"],
    });

    expect(result).to.deep.equal({ user: { name: "Ana" } });
  });

  it("should ignore nested keys when intermediate path is not an object", () => {
    const result = omit({
      obj: { user: "not an object" },
      keys: ["user.name"],
    });

    expect(result).to.deep.equal({ user: "not an object" });
  });

  it("should throw an error if obj is not an object", () => {
    // @ts-expect-error - testing invalid input
    expect(() => omit({ obj: "not an object", keys: ["id"] })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw an error if obj is null", () => {
    // @ts-expect-error - testing invalid input
    expect(() => omit({ obj: null, keys: ["id"] })).to.throw(
      "The 'obj' parameter is not an object",
    );
  });

  it("should throw an error if keys is not an array", () => {
    // @ts-expect-error - testing invalid input
    expect(() => omit({ obj: { id: 1 }, keys: "id" })).to.throw(
      "The 'keys' parameter is not an array",
    );
  });
});
