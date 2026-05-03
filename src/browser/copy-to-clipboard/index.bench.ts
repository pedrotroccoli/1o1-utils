import { Bench } from "tinybench";
import { copyToClipboard } from "./index.js";

type GlobalLike = typeof globalThis & {
  isSecureContext?: boolean;
  navigator?: unknown;
};

const g = globalThis as GlobalLike;

g.isSecureContext = true;
g.navigator = {
  clipboard: {
    writeText: async (_: string) => undefined,
  },
};

const short = "Hello world";
const long = "x".repeat(10_000);

const bench = new Bench({ name: "copyToClipboard", time: 1000 });

bench
  .add("1o1-utils (short)", async () => {
    await copyToClipboard({ text: short });
  })
  .add("1o1-utils (long)", async () => {
    await copyToClipboard({ text: long });
  });

export { bench };
