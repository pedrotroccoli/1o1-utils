import lodashGroupBy from "lodash/groupBy.js";
import { group } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { groupBy } from "./index.js";

const bench = new Bench({ name: "groupBy", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => {
      groupBy({ array: data, key: "role" });
    })
    .add(`lodash (${name})`, () => {
      lodashGroupBy(data, "role");
    })
    .add(`radash (${name})`, () => {
      group(data, (u) => u.role);
    })
    .add(`native reduce (${name})`, () => {
      data.reduce<Record<string, typeof data>>((acc, item) => {
        const k = item.role;
        if (acc[k] === undefined) {
          acc[k] = [];
        }
        acc[k].push(item);
        return acc;
      }, {});
    });
}

export { bench };
