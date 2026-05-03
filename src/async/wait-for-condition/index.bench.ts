import { Bench } from "tinybench";
import { waitForCondition } from "./index.js";

const bench = new Bench({ name: "waitForCondition", time: 500 });

bench
  .add("1o1-utils (resolves immediately)", async () => {
    await waitForCondition({
      condition: () => true,
      interval: 10,
      timeout: 1000,
    });
  })
  .add("naive while-sleep loop (resolves immediately)", async () => {
    const cond = () => true;
    while (!cond()) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  });

export { bench };
