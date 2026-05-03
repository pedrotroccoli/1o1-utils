import { Bench } from "tinybench";
import { isValidEmail } from "./index.js";

const SIMPLE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function regexIsValidEmail(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return SIMPLE_REGEX.test(input);
}

function nativeIsValidEmail(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  const at = input.indexOf("@");
  if (at <= 0 || at >= input.length - 1) return false;
  const dot = input.lastIndexOf(".");
  return dot > at + 1 && dot < input.length - 1;
}

const valid = "user+tag@mail.example.com";
const invalid = "not-an-email";
const longish = `${"a".repeat(40)}@${"b".repeat(40)}.example.com`;

const bench = new Bench({ name: "isValidEmail", time: 1000 });

bench
  .add("1o1-utils (valid)", () => {
    isValidEmail({ email: valid });
  })
  .add("simple regex (valid)", () => {
    regexIsValidEmail(valid);
  })
  .add("native string check (valid)", () => {
    nativeIsValidEmail(valid);
  });

bench
  .add("1o1-utils (invalid)", () => {
    isValidEmail({ email: invalid });
  })
  .add("simple regex (invalid)", () => {
    regexIsValidEmail(invalid);
  })
  .add("native string check (invalid)", () => {
    nativeIsValidEmail(invalid);
  });

bench
  .add("1o1-utils (longish)", () => {
    isValidEmail({ email: longish });
  })
  .add("simple regex (longish)", () => {
    regexIsValidEmail(longish);
  })
  .add("native string check (longish)", () => {
    nativeIsValidEmail(longish);
  });

export { bench };
