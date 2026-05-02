import lodashZip from "lodash/zip.js";
import { zip as radashZip } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { zip } from "./index.js";

const bench = new Bench({ name: "zip", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  const ids = data.map((u) => u.id);
  const names = data.map((u) => u.name);
  const ages = data.map((u) => u.age);

  bench
    .add(`1o1-utils (${name})`, () => {
      zip({ arrays: [ids, names, ages] });
    })
    .add(`lodash (${name})`, () => {
      lodashZip(ids, names, ages);
    })
    .add(`radash zip (${name})`, () => {
      radashZip(ids, names, ages);
    })
    .add(`native for-loop (${name})`, () => {
      const length = Math.max(ids.length, names.length, ages.length);
      const result: unknown[][] = new Array(length);
      for (let i = 0; i < length; i++) {
        result[i] = [ids[i], names[i], ages[i]];
      }
    });
}

export { bench };
