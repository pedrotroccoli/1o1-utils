import { expect } from "chai";
import { sortBy } from "./index.js";

describe("sortBy", () => {
  it("should sort by a string key in ascending order", () => {
    const result = sortBy({
      array: [{ name: "Bob" }, { name: "Ana" }, { name: "Carlos" }],
      key: "name",
    });

    expect(result).to.deep.equal([
      { name: "Ana" },
      { name: "Bob" },
      { name: "Carlos" },
    ]);
  });

  it("should sort by a numeric key in ascending order", () => {
    const result = sortBy({
      array: [{ age: 30 }, { age: 20 }, { age: 25 }],
      key: "age",
    });

    expect(result).to.deep.equal([{ age: 20 }, { age: 25 }, { age: 30 }]);
  });

  it("should sort in descending order", () => {
    const result = sortBy({
      array: [{ age: 30 }, { age: 20 }, { age: 25 }],
      key: "age",
      order: "desc",
    });

    expect(result).to.deep.equal([{ age: 30 }, { age: 25 }, { age: 20 }]);
  });

  it("should return an empty array for an empty array", () => {
    const result = sortBy({ array: [] as { id: number }[], key: "id" });
    expect(result).to.deep.equal([]);
  });

  it("should return a single-element array as is", () => {
    const result = sortBy({ array: [{ id: 1 }], key: "id" });
    expect(result).to.deep.equal([{ id: 1 }]);
  });

  it("should not mutate the original array", () => {
    const original = [{ age: 30 }, { age: 10 }, { age: 20 }];
    const result = sortBy({ array: original, key: "age" });

    expect(result).to.not.equal(original);
    expect(original).to.deep.equal([{ age: 30 }, { age: 10 }, { age: 20 }]);
  });

  it("should handle equal values stably", () => {
    const result = sortBy({
      array: [
        { name: "Bob", id: 1 },
        { name: "Ana", id: 2 },
        { name: "Bob", id: 3 },
      ],
      key: "name",
    });

    expect(result).to.deep.equal([
      { name: "Ana", id: 2 },
      { name: "Bob", id: 1 },
      { name: "Bob", id: 3 },
    ]);
  });

  it("should handle undefined values in the key", () => {
    const result = sortBy({
      array: [
        { name: "Bob", team: "backend" },
        { name: "Ana", team: undefined },
        { name: "Carlos", team: "frontend" },
      ],
      key: "team",
    });

    expect(result).to.have.length(3);
    expect(result.map((r) => r.name)).to.include("Ana");
  });

  it("should sort by a nested key using dot notation", () => {
    const result = sortBy({
      array: [
        { name: "Bob", address: { city: "São Paulo" } },
        { name: "Ana", address: { city: "Curitiba" } },
        { name: "Carlos", address: { city: "Rio" } },
      ],
      key: "address.city",
    });

    expect(result).to.deep.equal([
      { name: "Ana", address: { city: "Curitiba" } },
      { name: "Carlos", address: { city: "Rio" } },
      { name: "Bob", address: { city: "São Paulo" } },
    ]);
  });

  it("should sort by a deeply nested key using dot notation", () => {
    const result = sortBy({
      array: [
        { id: 1, meta: { score: { value: 90 } } },
        { id: 2, meta: { score: { value: 50 } } },
        { id: 3, meta: { score: { value: 70 } } },
      ],
      key: "meta.score.value",
      order: "desc",
    });

    expect(result).to.deep.equal([
      { id: 1, meta: { score: { value: 90 } } },
      { id: 3, meta: { score: { value: 70 } } },
      { id: 2, meta: { score: { value: 50 } } },
    ]);
  });

  it("should handle missing nested paths gracefully", () => {
    const result = sortBy({
      array: [
        { name: "Bob", address: { city: "São Paulo" } },
        { name: "Ana" },
        { name: "Carlos", address: { city: "Curitiba" } },
      ],
      key: "address.city",
    });

    expect(result).to.have.length(3);
  });

  it("should throw an error if array is not an array", () => {
    // @ts-expect-error
    expect(() => sortBy({ array: "not-an-array", key: "id" })).to.throw(
      "The 'array' parameter is not an array",
    );
  });

  it("should throw an error if key is not provided", () => {
    // @ts-expect-error
    expect(() => sortBy({ array: [{ id: 1 }] })).to.throw(
      "The 'key' parameter is required",
    );
  });
});
