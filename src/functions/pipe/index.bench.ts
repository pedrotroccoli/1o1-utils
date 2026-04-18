import { flow as esToolkitFlow } from "es-toolkit";
import lodashFlow from "lodash/flow.js";
import { Bench } from "tinybench";
import { pipe } from "./index.js";

const f1 = (x: number) => x + 1;
const f2 = (x: number) => x * 2;
const f3 = (x: number) => x - 3;

const bench = new Bench({ name: "pipe", time: 1000 });

bench
  .add("1o1-utils (creation)", () => {
    pipe(f1, f2, f3);
  })
  .add("lodash (creation)", () => {
    lodashFlow(f1, f2, f3);
  })
  .add("es-toolkit (creation)", () => {
    esToolkitFlow(f1, f2, f3);
  });

const piped = pipe(f1, f2, f3);
const flowedLodash = lodashFlow(f1, f2, f3);
const flowedEsToolkit = esToolkitFlow(f1, f2, f3);

bench
  .add("1o1-utils (invocation)", () => {
    piped(10);
  })
  .add("lodash (invocation)", () => {
    flowedLodash(10);
  })
  .add("es-toolkit (invocation)", () => {
    flowedEsToolkit(10);
  });

export { bench };
