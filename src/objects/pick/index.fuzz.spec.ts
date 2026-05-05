import { expect } from "chai";
import * as fc from "fast-check";
import { afterEach, describe, it } from "mocha";
import { pick } from "./index.js";

describe("pick (fuzz)", () => {
  afterEach(() => {
    // biome-ignore lint/suspicious/noExplicitAny: prototype probe cleanup
    delete (Object.prototype as any).polluted;
  });

  it("never throws on arbitrary string keys + object inputs", () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.jsonValue()),
        fc.array(fc.string(), { maxLength: 16 }),
        (obj, keys) => {
          const result = pick({ obj, keys });
          expect(result).to.be.an("object");
        },
      ),
      { numRuns: 500 },
    );
  });

  it("never pollutes Object.prototype regardless of input", () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.jsonValue()),
        fc.array(
          fc.oneof(
            fc.constant("__proto__"),
            fc.constant("constructor"),
            fc.constant("prototype"),
            fc.constant("__proto__.polluted"),
            fc.constant("constructor.prototype.polluted"),
            fc.constant("a.__proto__.polluted"),
            fc.string(),
          ),
          { maxLength: 16 },
        ),
        (obj, keys) => {
          pick({ obj, keys });
          // biome-ignore lint/suspicious/noExplicitAny: prototype probe
          expect((Object.prototype as any).polluted).to.be.undefined;
        },
      ),
      { numRuns: 500 },
    );
  });

  it("only returns own keys present in source", () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string({ minLength: 1 }).filter((s) => !s.includes(".")),
          fc.jsonValue(),
        ),
        fc.array(
          fc.string({ minLength: 1 }).filter((s) => !s.includes(".")),
          {
            maxLength: 16,
          },
        ),
        (obj, keys) => {
          const result = pick({ obj, keys });
          for (const k of Object.keys(result)) {
            expect(Object.hasOwn(obj, k)).to.equal(true);
          }
        },
      ),
      { numRuns: 500 },
    );
  });
});
