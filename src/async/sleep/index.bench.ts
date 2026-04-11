import { sleep as radashSleep } from "radash";
import { Bench } from "tinybench";
import { sleep } from "./index.js";

const bench = new Bench({ name: "sleep", time: 500 });

bench
  .add("1o1-utils (0ms)", async () => {
    await sleep({ ms: 0 });
  })
  .add("radash (0ms)", async () => {
    await radashSleep(0);
  })
  .add("native setTimeout (0ms)", async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });

export { bench };
