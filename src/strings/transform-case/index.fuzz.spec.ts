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

  it("scales sub-quadratically on long pathological inputs (no ReDoS)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...STYLES), (to) => {
        const small = "aA".repeat(1000);
        const large = "aA".repeat(10000);

        const t0 = performance.now();
        transformCase({ str: small, to });
        const tSmall = performance.now() - t0;

        const t1 = performance.now();
        transformCase({ str: large, to });
        const tLarge = performance.now() - t1;

        // Linear: ~10x. Polynomial ReDoS would be 100x+. Allow 30x for noise.
        const ratio = tLarge / Math.max(tSmall, 0.01);
        expect(ratio).to.be.lessThan(30);
      }),
      { numRuns: 5 },
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
