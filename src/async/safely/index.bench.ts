import { tryit as radashTryit } from "radash";
import { Bench } from "tinybench";
import { safely } from "./index.js";

const bench = new Bench({ name: "safely", time: 500 });

const syncOk = (x: number) => x * 2;
const syncThrow = () => {
  throw new Error("nope");
};
const asyncOk = async (x: number) => x * 2;
const asyncThrow = async () => {
  throw new Error("nope");
};

bench
  .add("1o1-utils (sync ok)", () => {
    safely(syncOk)(21);
  })
  .add("native try/catch (sync ok)", () => {
    try {
      syncOk(21);
    } catch {
      // noop
    }
  })
  .add("radash (sync ok)", async () => {
    await radashTryit(syncOk)(21);
  })
  .add("1o1-utils (sync throw)", () => {
    safely(syncThrow)();
  })
  .add("native try/catch (sync throw)", () => {
    try {
      syncThrow();
    } catch {
      // noop
    }
  })
  .add("1o1-utils (async ok)", async () => {
    await safely(asyncOk)(21);
  })
  .add("radash (async ok)", async () => {
    await radashTryit(asyncOk)(21);
  })
  .add("1o1-utils (async throw)", async () => {
    await safely(asyncThrow)();
  })
  .add("radash (async throw)", async () => {
    await radashTryit(asyncThrow)();
  });

export { bench };
