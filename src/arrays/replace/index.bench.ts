import { Bench } from "tinybench";
import { getDatasets, type User } from "../../benchmarks/helpers.js";
import { replace } from "./index.js";

const bench = new Bench({ name: "replace (by id)", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  const targetId = data[Math.floor(data.length / 2)].id;
  const isTarget = (u: User) => u.id === targetId;
  const replacement: User = {
    id: targetId,
    name: "Replaced",
    age: 99,
    role: "admin",
    department: "engineering",
    email: "replaced@example.com",
  };

  bench
    .add(`1o1-utils first (${name})`, () => {
      replace({ array: data, predicate: isTarget, value: replacement });
    })
    .add(`1o1-utils all (${name})`, () => {
      replace({
        array: data,
        predicate: isTarget,
        value: replacement,
        all: true,
      });
    })
    // Native map ternary — calls predicate once per item, returns new array.
    .add(`native map ternary (${name})`, () => {
      data.map((u) => (isTarget(u) ? replacement : u));
    })
    // Native single-pass for loop — typical hand-written replace.
    .add(`native single-pass (${name})`, () => {
      const out: User[] = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = isTarget(data[i]) ? replacement : data[i];
      }
    });
}

export { bench };
