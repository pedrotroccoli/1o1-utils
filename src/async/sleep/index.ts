import type { SleepParams } from "./types.js";

function sleep({ ms }: SleepParams): Promise<void> {
  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("The 'ms' parameter must be a number");
  }

  if (ms < 0) {
    throw new Error("The 'ms' parameter must be a non-negative number");
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
