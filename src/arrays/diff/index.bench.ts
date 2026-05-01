import lodashDifferenceBy from "lodash/differenceBy.js";
import { diff as radashDiff } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { diff } from "./index.js";

const bench = new Bench({ name: "diff (by id)", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  const valuesSlice = data.slice(0, Math.max(1, Math.floor(data.length / 10)));

  bench
    .add(`1o1-utils (${name})`, () => {
      diff({ array: data, values: valuesSlice, iteratee: (u) => u.id });
    })
    .add(`lodash differenceBy (${name})`, () => {
      lodashDifferenceBy(data, valuesSlice, "id");
    })
    .add(`radash diff (${name})`, () => {
      radashDiff(data, valuesSlice, (u) => u.id);
    })
    .add(`native Set+filter (${name})`, () => {
      const excluded = new Set(valuesSlice.map((u) => u.id));
      data.filter((u) => !excluded.has(u.id));
    });
}

export { bench };
