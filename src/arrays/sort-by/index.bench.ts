import lodashSortBy from "lodash/sortBy.js";
import { sort } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { sortBy } from "./index.js";

const bench = new Bench({ name: "sortBy", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => {
      sortBy({ array: data, key: "age" });
    })
    .add(`lodash (${name})`, () => {
      lodashSortBy(data, "age");
    })
    .add(`radash (${name})`, () => {
      sort(data, (u) => u.age);
    })
    .add(`native slice+sort (${name})`, () => {
      data.slice().sort((a, b) => a.age - b.age);
    });
}

export { bench };
