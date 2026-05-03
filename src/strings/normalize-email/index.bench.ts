import { Bench } from "tinybench";
import { normalizeEmail } from "./index.js";

function nativeNormalize(email: string): string {
  return email.trim().toLowerCase();
}

function nativeNormalizeStripPlus(email: string): string {
  const lower = email.trim().toLowerCase();
  const at = lower.indexOf("@");
  if (at < 0) return lower;
  const plus = lower.indexOf("+");
  if (plus < 0 || plus > at) return lower;
  return lower.slice(0, plus) + lower.slice(at);
}

const REGEX_STRIP = /\+[^@]*(?=@)/;
function regexNormalizeStripPlus(email: string): string {
  return email.trim().toLowerCase().replace(REGEX_STRIP, "");
}

const plain = "User@Example.COM";
const padded = "  User+Promotions@Gmail.COM  ";
const longish = `  ${"a".repeat(40)}+tag-${"b".repeat(20)}@${"c".repeat(40)}.example.com  `;

const bench = new Bench({ name: "normalizeEmail", time: 1000 });

bench
  .add("1o1-utils (plain)", () => {
    normalizeEmail({ email: plain });
  })
  .add("native (plain)", () => {
    nativeNormalize(plain);
  });

bench
  .add("1o1-utils (padded + plus)", () => {
    normalizeEmail({ email: padded, stripPlus: true });
  })
  .add("native (padded + plus)", () => {
    nativeNormalizeStripPlus(padded);
  })
  .add("regex (padded + plus)", () => {
    regexNormalizeStripPlus(padded);
  });

bench
  .add("1o1-utils (longish)", () => {
    normalizeEmail({ email: longish, stripPlus: true });
  })
  .add("native (longish)", () => {
    nativeNormalizeStripPlus(longish);
  })
  .add("regex (longish)", () => {
    regexNormalizeStripPlus(longish);
  });

export { bench };
