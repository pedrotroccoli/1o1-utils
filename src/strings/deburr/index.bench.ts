import { Bench } from "tinybench";
import { deburr } from "./index.js";

function nativeDeburr(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const ascii = "hello world";
const shortAccented = "São Paulo";
const longAccented = `${"résumé ".repeat(20)}café ${"naïve ".repeat(20)}`;

const bench = new Bench({ name: "deburr", time: 1000 });

bench
  .add("1o1-utils (ascii)", () => {
    deburr({ str: ascii });
  })
  .add("native (ascii)", () => {
    nativeDeburr(ascii);
  });

bench
  .add("1o1-utils (short accented)", () => {
    deburr({ str: shortAccented });
  })
  .add("native (short accented)", () => {
    nativeDeburr(shortAccented);
  });

bench
  .add("1o1-utils (long accented)", () => {
    deburr({ str: longAccented });
  })
  .add("native (long accented)", () => {
    nativeDeburr(longAccented);
  });

export { bench };
