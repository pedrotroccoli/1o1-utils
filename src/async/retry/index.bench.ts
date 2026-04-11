import { retry as radashRetry } from "radash";
import { Bench } from "tinybench";
import { retry } from "./index.js";

const bench = new Bench({ name: "retry", time: 1000 });

const succeedFn = () => "ok";

bench
  .add("1o1-utils (succeeds immediately)", async () => {
    await retry({ fn: succeedFn, delay: 0 });
  })
  .add("radash (succeeds immediately)", async () => {
    await radashRetry({}, succeedFn);
  })
  .add("native (succeeds immediately)", async () => {
    await succeedFn();
  });

bench
  .add("1o1-utils (fails once, fixed)", async () => {
    let calls = 0;
    await retry({
      fn: () => {
        calls++;
        if (calls === 1) throw new Error("fail");
        return "ok";
      },
      delay: 0,
    });
  })
  .add("radash (fails once)", async () => {
    let calls = 0;
    await radashRetry({ delay: 0 }, () => {
      calls++;
      if (calls === 1) throw new Error("fail");
      return "ok";
    });
  })
  .add("native (fails once)", async () => {
    let calls = 0;
    while (true) {
      try {
        calls++;
        if (calls === 1) throw new Error("fail");
        break;
      } catch {
        if (calls >= 3) throw new Error("fail");
      }
    }
  });

export { bench };
