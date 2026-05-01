import lodashUnzip from "lodash/unzip.js";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { unzip } from "./index.js";

const bench = new Bench({ name: "unzip", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  const tuples: [string, string, number][] = data.map((u) => [
    u.id,
    u.name,
    u.age,
  ]);

  bench
    .add(`1o1-utils (${name})`, () => {
      unzip({ array: tuples });
    })
    .add(`lodash (${name})`, () => {
      lodashUnzip(tuples);
    })
    .add(`native for-loop (${name})`, () => {
      const length = tuples.length;
      const a: string[] = new Array(length);
      const b: string[] = new Array(length);
      const c: number[] = new Array(length);
      for (let i = 0; i < length; i++) {
        a[i] = tuples[i][0];
        b[i] = tuples[i][1];
        c[i] = tuples[i][2];
      }
    });
}

export { bench };
