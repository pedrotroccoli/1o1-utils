import { expect } from "chai";
import { groupBy } from "./index.js";

describe("groupBy", () => {
  it("should group array items by a given key", () => {
    const result = groupBy({
      array: [
        { role: "admin", name: "Ana" },
        { role: "user", name: "Bob" },
        { role: "admin", name: "Carlos" },
      ],
      key: "role",
    });

    expect(result).to.deep.equal({
      admin: [
        { role: "admin", name: "Ana" },
        { role: "admin", name: "Carlos" },
      ],
      user: [{ role: "user", name: "Bob" }],
    });
  });

  it("should return an empty object for an empty array", () => {
    const result = groupBy({ array: [] as { role: string }[], key: "role" });
    expect(result).to.deep.equal({});
  });

  it("should handle a single group", () => {
    const result = groupBy({
      array: [
        { status: "active", id: 1 },
        { status: "active", id: 2 },
      ],
      key: "status",
    });

    expect(result).to.deep.equal({
      active: [
        { status: "active", id: 1 },
        { status: "active", id: 2 },
      ],
    });
  });

  it("should handle keys with undefined values", () => {
    const result = groupBy({
      array: [
        { name: "Ana", team: undefined },
        { name: "Bob", team: "backend" },
      ],
      key: "team",
    });

    expect(result).to.deep.equal({
      undefined: [{ name: "Ana", team: undefined }],
      backend: [{ name: "Bob", team: "backend" }],
    });
  });

  it("should coerce numeric key values to strings", () => {
    const result = groupBy({
      array: [
        { name: "Ana", age: 30 },
        { name: "Bob", age: 30 },
        { name: "Carlos", age: 25 },
      ],
      key: "age",
    });

    expect(result).to.deep.equal({
      "30": [
        { name: "Ana", age: 30 },
        { name: "Bob", age: 30 },
      ],
      "25": [{ name: "Carlos", age: 25 }],
    });
  });

  it("should throw an error if array is not an array", () => {
    // @ts-expect-error
    expect(() => groupBy({ array: "not-an-array", key: "id" })).to.throw(
      "The 'array' parameter is not an array",
    );
  });

  it("should throw an error if key is not provided", () => {
    // @ts-expect-error
    expect(() => groupBy({ array: [{ id: 1 }] })).to.throw(
      "The 'key' parameter is required",
    );
  });
});
