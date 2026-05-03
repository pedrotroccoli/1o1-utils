import { Bench } from "tinybench";
import { isValidPhone } from "./index.js";

const SIMPLE_REGEX = /^\+\d{1,15}$/;

function regexIsValidPhone(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return SIMPLE_REGEX.test(input);
}

function nativeIsValidPhone(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  if (input.charCodeAt(0) !== 43) return false;
  for (let i = 1; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return input.length >= 2 && input.length <= 16;
}

const valid = "+15551234567";
const invalid = "not-a-phone";
const longish = "+44 (20) 7946 0958";

const bench = new Bench({ name: "isValidPhone", time: 1000 });

bench
  .add("1o1-utils (valid)", () => {
    isValidPhone({ phone: valid });
  })
  .add("simple regex (valid)", () => {
    regexIsValidPhone(valid);
  })
  .add("native check (valid)", () => {
    nativeIsValidPhone(valid);
  });

bench
  .add("1o1-utils (invalid)", () => {
    isValidPhone({ phone: invalid });
  })
  .add("simple regex (invalid)", () => {
    regexIsValidPhone(invalid);
  })
  .add("native check (invalid)", () => {
    nativeIsValidPhone(invalid);
  });

bench
  .add("1o1-utils (longish)", () => {
    isValidPhone({ phone: longish });
  })
  .add("simple regex (longish)", () => {
    regexIsValidPhone(longish);
  })
  .add("native check (longish)", () => {
    nativeIsValidPhone(longish);
  });

export { bench };
