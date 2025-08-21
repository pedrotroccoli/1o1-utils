import { describe, it } from "mocha";
import { expect } from "chai";
import { arrayToHash } from "./index";

type TestType = {
  id: string;
  name: string;
};

describe("arrayToHash", () => {
  const testArray: TestType[] = [
    { id: "1", name: "John" },
    { id: "2", name: "Jane" },
    { id: "3", name: "Jim" },
  ];

  it("should return an object with the key and value of the array", () => {
    const result = arrayToHash<TestType>({ array: testArray, key: "id" });

    expect(result).to.deep.equal({
      "1": { id: "1", name: "John" },
      "2": { id: "2", name: "Jane" },
      "3": { id: "3", name: "Jim" },
    });
  });
});