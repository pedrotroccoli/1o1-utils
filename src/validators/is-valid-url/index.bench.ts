import { Bench } from "tinybench";
import { isValidUrl } from "./index.js";

const URL_REGEX =
  /^(?:[a-z][a-z0-9+.-]*:)(?:\/\/(?:[^\s/?#]*@)?[^\s/?#]+)?(?:[^\s?#]*)(?:\?[^\s#]*)?(?:#\S*)?$/i;

function regexIsValidUrl(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return URL_REGEX.test(input);
}

function nativeIsValidUrl(input: unknown): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

const valid = "https://example.com/path?q=1#section";
const invalid = "not-a-url";
const localhost = "http://localhost:3000";

const bench = new Bench({ name: "isValidUrl", time: 1000 });

bench
  .add("1o1-utils (valid)", () => {
    isValidUrl({ url: valid });
  })
  .add("native try/catch (valid)", () => {
    nativeIsValidUrl(valid);
  })
  .add("regex (valid)", () => {
    regexIsValidUrl(valid);
  });

bench
  .add("1o1-utils (invalid)", () => {
    isValidUrl({ url: invalid });
  })
  .add("native try/catch (invalid)", () => {
    nativeIsValidUrl(invalid);
  })
  .add("regex (invalid)", () => {
    regexIsValidUrl(invalid);
  });

bench
  .add("1o1-utils (localhost)", () => {
    isValidUrl({ url: localhost });
  })
  .add("native try/catch (localhost)", () => {
    nativeIsValidUrl(localhost);
  })
  .add("regex (localhost)", () => {
    regexIsValidUrl(localhost);
  });

export { bench };
