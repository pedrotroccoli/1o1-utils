import lodashTruncate from "lodash/truncate.js";
import { Bench } from "tinybench";
import { truncate } from "./index.js";

const short = "Hello";
const medium = "The quick brown fox jumps over the lazy dog";
const long = "Lorem ipsum dolor sit amet. ".repeat(100);

function nativeTruncate(str: string, length: number, suffix = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

const bench = new Bench({ name: "truncate", time: 1000 });

bench
  .add("1o1-utils (short, no-op)", () => {
    truncate({ str: short, length: 10 });
  })
  .add("lodash (short, no-op)", () => {
    lodashTruncate(short, { length: 10 });
  })
  .add("native (short, no-op)", () => {
    nativeTruncate(short, 10);
  });

bench
  .add("1o1-utils (medium)", () => {
    truncate({ str: medium, length: 20 });
  })
  .add("lodash (medium)", () => {
    lodashTruncate(medium, { length: 20 });
  })
  .add("native (medium)", () => {
    nativeTruncate(medium, 20);
  });

bench
  .add("1o1-utils (long)", () => {
    truncate({ str: long, length: 50 });
  })
  .add("lodash (long)", () => {
    lodashTruncate(long, { length: 50 });
  })
  .add("native (long)", () => {
    nativeTruncate(long, 50);
  });

export { bench };
