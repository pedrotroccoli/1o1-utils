import lodashPartition from "lodash/partition.js";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { partition } from "./index.js";

const bench = new Bench({ name: "partition (by role)", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  const isAdmin = (u: { role: string }) => u.role === "admin";

  bench
    .add(`1o1-utils (${name})`, () => {
      partition({ array: data, predicate: isAdmin });
    })
    .add(`lodash partition (${name})`, () => {
      lodashPartition(data, isAdmin);
    })
    // Naive two-filter calls the predicate twice per item — included as the
    // realistic baseline a typical user would write, not a fair single-call
    // comparison.
    .add(`native two-filter (${name})`, () => {
      const matches = data.filter(isAdmin);
      const rest = data.filter((u) => !isAdmin(u));
      return [matches, rest];
    })
    // Cached two-filter calls the predicate once per item, then partitions
    // by membership — fair single-call comparison.
    .add(`native two-filter cached (${name})`, () => {
      const flags = data.map(isAdmin);
      const matches = data.filter((_, i) => flags[i]);
      const rest = data.filter((_, i) => !flags[i]);
      return [matches, rest];
    })
    .add(`native single-pass (${name})`, () => {
      const matches: typeof data = [];
      const rest: typeof data = [];
      for (let i = 0; i < data.length; i++) {
        if (isAdmin(data[i])) matches.push(data[i]);
        else rest.push(data[i]);
      }
    });
}

export { bench };
