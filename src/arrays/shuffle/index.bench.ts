import lodashShuffle from "lodash/shuffle.js";
import { shuffle as radashShuffle } from "radash";
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { shuffle } from "./index.js";

const bench = new Bench({ name: "shuffle", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => {
      shuffle({ array: data });
    })
    .add(`lodash shuffle (${name})`, () => {
      lodashShuffle(data);
    })
    .add(`radash shuffle (${name})`, () => {
      radashShuffle(data);
    })
    .add(`native (${name})`, () => {
      const copy = data.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
    });
}

export { bench };
