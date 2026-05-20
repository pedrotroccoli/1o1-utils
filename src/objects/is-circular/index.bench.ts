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

function buildDeep(depth: number): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let cursor = root;
  for (let i = 0; i < depth; i++) {
    const next: Record<string, unknown> = { i };
    cursor.next = next;
    cursor = next;
  }
  return root;
}

function buildDeepCycle(depth: number): Record<string, unknown> {
  const root = buildDeep(depth);
  let cursor: Record<string, unknown> = root;
  while (cursor.next) cursor = cursor.next as Record<string, unknown>;
  cursor.back = root;
  return root;
}

function buildSelfRef(): Record<string, unknown> {
  const obj: Record<string, unknown> = { a: 1 };
  obj.self = obj;
  return obj;
}

const shallow = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const deep = buildDeep(50);
const selfRef = buildSelfRef();
const deepCycle = buildDeepCycle(50);

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
