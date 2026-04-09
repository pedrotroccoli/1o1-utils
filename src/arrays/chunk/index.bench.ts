import lodashChunk from "lodash/chunk.js";
import { Bench } from "tinybench";
import { DATASETS } from "../../benchmarks/helpers.js";
import { chunk } from "./index.js";

const bench = new Bench({ name: "chunk", time: 1000 });

for (const { name, data: getData } of DATASETS) {
  const data = getData();
  const size = Math.max(10, Math.floor(data.length / 10));

  bench
    .add(`1o1-utils (${name})`, () => {
      chunk({ array: data, size });
    })
    .add(`lodash (${name})`, () => {
      lodashChunk(data, size);
    })
    .add(`native for+slice (${name})`, () => {
      const result: (typeof data)[] = [];
      for (let i = 0; i < data.length; i += size) {
        result.push(data.slice(i, i + size));
      }
    });
}

export { bench };
