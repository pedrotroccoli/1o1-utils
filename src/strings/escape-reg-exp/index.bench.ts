import lodashEscapeRegExp from "lodash/escapeRegExp.js";
import { Bench } from "tinybench";
import { escapeRegExp } from "./index.js";

const short = "[hello](world)";
const medium = "a.b*c?(d)+[e]^f$g{h}|i\\j";
// biome-ignore lint/suspicious/noTemplateCurlyInString: literal regex specials
const long = ".*+?^${}()|[]\\".repeat(100);

const NATIVE_RE = /[.*+?^${}()|[\]\\]/g;
function nativeEscape(str: string): string {
  return str.replace(NATIVE_RE, "\\$&");
}

const bench = new Bench({ name: "escapeRegExp", time: 1000 });

bench
  .add("1o1-utils (short)", () => {
    escapeRegExp({ str: short });
  })
  .add("lodash (short)", () => {
    lodashEscapeRegExp(short);
  })
  .add("native (short)", () => {
    nativeEscape(short);
  });

bench
  .add("1o1-utils (medium)", () => {
    escapeRegExp({ str: medium });
  })
  .add("lodash (medium)", () => {
    lodashEscapeRegExp(medium);
  })
  .add("native (medium)", () => {
    nativeEscape(medium);
  });

bench
  .add("1o1-utils (long)", () => {
    escapeRegExp({ str: long });
  })
  .add("lodash (long)", () => {
    lodashEscapeRegExp(long);
  })
  .add("native (long)", () => {
    nativeEscape(long);
  });

export { bench };
