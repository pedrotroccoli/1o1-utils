import { Bench } from "tinybench";
import { withTimeout } from "./index.js";

const bench = new Bench({ name: "withTimeout", time: 500 });

bench
  .add("1o1-utils (resolves immediately)", async () => {
    await withTimeout({ promise: Promise.resolve("ok"), ms: 1000 });
  })
  .add("native Promise.race (resolves immediately)", async () => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), 1000);
    });
    await Promise.race([Promise.resolve("ok"), timeout]).finally(() => {
      if (timer !== undefined) clearTimeout(timer);
    });
  });

export { bench };
