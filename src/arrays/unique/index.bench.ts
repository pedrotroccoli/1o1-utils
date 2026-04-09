import lodashUniqBy from "lodash/uniqBy.js";
import { unique as radashUnique } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { unique } from "./index.js";

const bench = new Bench({ name: "unique (by key)", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => {
      unique({ array: data, key: "role" });
    })
    .add(`lodash uniqBy (${name})`, () => {
      lodashUniqBy(data, "role");
    })
    .add(`radash unique (${name})`, () => {
      radashUnique(data, (u) => u.role);
    })
    .add(`native Set+filter (${name})`, () => {
      const seen = new Set<string>();
      data.filter((item) => {
        if (seen.has(item.role)) return false;
        seen.add(item.role);
        return true;
      });
    });
}

export { bench };
