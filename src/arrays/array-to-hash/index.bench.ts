import lodashKeyBy from "lodash/keyBy.js";
import { objectify } from "radash";
import { Bench } from "tinybench";
import { DATASETS_CAPPED as DATASETS } from "../../benchmarks/helpers.js";
import { arrayToHash } from "./index.js";

const bench = new Bench({ name: "arrayToHash / keyBy", time: 1000 });

for (const { name, data: getData } of DATASETS) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => {
      arrayToHash({ array: data, key: "id" });
    })
    .add(`lodash keyBy (${name})`, () => {
      lodashKeyBy(data, "id");
    })
    .add(`radash objectify (${name})`, () => {
      objectify(data, (u) => u.id);
    })
    .add(`native for loop (${name})`, () => {
      const result: Record<string, (typeof data)[0]> = {};
      for (let i = 0; i < data.length; i++) {
        result[data[i].id] = data[i];
      }
    });
}

export { bench };
