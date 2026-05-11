import { Bench } from "tinybench";
import { generateString } from "./index.js";

const ALPHA_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const HEX_POOL = "0123456789abcdef";
const ALL_POOL =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?/";

function nativeGenerate(pool: string, length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += pool[Math.floor(Math.random() * pool.length)];
  }
  return out;
}

const bench = new Bench({ name: "generateString", time: 1000 });

bench
  .add("1o1-utils (alphanumeric, len 16)", () => {
    generateString({ length: 16, charset: "alphanumeric" });
  })
  .add("native Math.random (alphanumeric, len 16)", () => {
    nativeGenerate(ALPHA_POOL, 16);
  });

bench
  .add("1o1-utils (alphanumeric, len 64)", () => {
    generateString({ length: 64, charset: "alphanumeric" });
  })
  .add("native Math.random (alphanumeric, len 64)", () => {
    nativeGenerate(ALPHA_POOL, 64);
  });

bench
  .add("1o1-utils (alphanumeric, len 256)", () => {
    generateString({ length: 256, charset: "alphanumeric" });
  })
  .add("native Math.random (alphanumeric, len 256)", () => {
    nativeGenerate(ALPHA_POOL, 256);
  });

bench
  .add("1o1-utils (hex, len 32)", () => {
    generateString({ length: 32, charset: "hex" });
  })
  .add("native Math.random (hex, len 32)", () => {
    nativeGenerate(HEX_POOL, 32);
  });

bench
  .add("1o1-utils (all, len 16)", () => {
    generateString({ length: 16, charset: "all" });
  })
  .add("native Math.random (all, len 16)", () => {
    nativeGenerate(ALL_POOL, 16);
  });

export { bench };
