import { Bench } from "tinybench";
import { isCircular } from "./index.js";

function naiveIsCircular(value: unknown): boolean {
  try {
    JSON.stringify(value);
    return false;
  } catch {
    return true;
  }
}

const shallow = { a: 1, b: 2, c: 3, d: 4, e: 5 };

const deep: Record<string, unknown> = {};
{
  let cursor = deep;
  for (let i = 0; i < 50; i++) {
    const next: Record<string, unknown> = { i };
    cursor.next = next;
    cursor = next;
  }
}

const selfRef: Record<string, unknown> = { a: 1 };
selfRef.self = selfRef;

const deepCycle: Record<string, unknown> = {};
{
  let cursor = deepCycle;
  for (let i = 0; i < 50; i++) {
    const next: Record<string, unknown> = { i };
    cursor.next = next;
    cursor = next;
  }
  cursor.back = deepCycle;
}

const bench = new Bench({ name: "isCircular", time: 1000 });

bench
  .add("1o1-utils (shallow no cycle)", () => {
    isCircular({ value: shallow });
  })
  .add("naive JSON.stringify (shallow no cycle)", () => {
    naiveIsCircular(shallow);
  });

bench
  .add("1o1-utils (deep no cycle)", () => {
    isCircular({ value: deep });
  })
  .add("naive JSON.stringify (deep no cycle)", () => {
    naiveIsCircular(deep);
  });

bench
  .add("1o1-utils (self-ref)", () => {
    isCircular({ value: selfRef });
  })
  .add("naive JSON.stringify (self-ref)", () => {
    naiveIsCircular(selfRef);
  });

bench
  .add("1o1-utils (deep cycle)", () => {
    isCircular({ value: deepCycle });
  })
  .add("naive JSON.stringify (deep cycle)", () => {
    naiveIsCircular(deepCycle);
  });

export { bench };
