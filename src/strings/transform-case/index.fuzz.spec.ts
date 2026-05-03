import { expect } from "chai";
import * as fc from "fast-check";
import { describe, it } from "mocha";
import { transformCase } from "./index.js";
import type { CaseStyle } from "./types.js";

const STYLES: CaseStyle[] = ["camel", "kebab", "snake", "pascal", "title"];

describe("transformCase (fuzz)", () => {
  it("never throws on arbitrary string input for any style", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.constantFrom(...STYLES),
        fc.boolean(),
        (str, to, preserveAcronyms) => {
          const out = transformCase({ str, to, preserveAcronyms });
          expect(out).to.be.a("string");
        },
      ),
      { numRuns: 1000 },
    );
  });

  it("runs in linear time on long pathological inputs (no ReDoS)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.constantFrom(...STYLES),
        (n, to) => {
          const str = "aA".repeat(n);
          const start = Date.now();
          transformCase({ str, to });
          expect(Date.now() - start).to.be.lessThan(500);
        },
      ),
      { numRuns: 20 },
    );
  });

  it("kebab output contains no underscores; snake output contains no hyphens", () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const kebab = transformCase({ str, to: "kebab" });
        const snake = transformCase({ str, to: "snake" });
        expect(kebab.includes("_")).to.equal(false);
        expect(snake.includes("-")).to.equal(false);
      }),
      { numRuns: 500 },
    );
  });
});
