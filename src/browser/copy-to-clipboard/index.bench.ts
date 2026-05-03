import { Bench } from "tinybench";
import { copyToClipboard } from "./index.js";

type GlobalLike = typeof globalThis & {
  isSecureContext?: boolean;
  navigator?: unknown;
};

const g = globalThis as GlobalLike;
const originalSecure = Object.getOwnPropertyDescriptor(g, "isSecureContext");
const originalNavigator = Object.getOwnPropertyDescriptor(g, "navigator");

const short = "Hello world";
const long = "x".repeat(10_000);

const bench = new Bench({
  name: "copyToClipboard",
  time: 1000,
  setup: () => {
    Object.defineProperty(g, "isSecureContext", {
      value: true,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(g, "navigator", {
      value: {
        clipboard: {
          writeText: async (_: string) => undefined,
        },
      },
      configurable: true,
      writable: true,
    });
  },
  teardown: () => {
    if (originalSecure) {
      Object.defineProperty(g, "isSecureContext", originalSecure);
    } else {
      delete (g as Record<string, unknown>).isSecureContext;
    }
    if (originalNavigator) {
      Object.defineProperty(g, "navigator", originalNavigator);
    } else {
      delete (g as Record<string, unknown>).navigator;
    }
  },
});

bench
  .add("1o1-utils (short)", async () => {
    await copyToClipboard({ text: short });
  })
  .add("1o1-utils (long)", async () => {
    await copyToClipboard({ text: long });
  });

export { bench };
