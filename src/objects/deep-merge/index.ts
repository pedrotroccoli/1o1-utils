import type { DeepMergeParams, DeepMergeResult } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

function deepMerge({ target, source }: DeepMergeParams): DeepMergeResult {
  if (!isPlainObject(target)) {
    throw new Error("The 'target' parameter is not an object");
  }

  if (!isPlainObject(source)) {
    throw new Error("The 'source' parameter is not an object");
  }

  const result = Object.assign({}, target);

  const stack: [Record<string, unknown>, Record<string, unknown>][] = [
    [result, source],
  ];

  while (stack.length > 0) {
    const [tgt, src] = stack.pop()!;
    const sourceKeys = Object.keys(src);

    for (let i = 0; i < sourceKeys.length; i++) {
      const key = sourceKeys[i];
      const sourceVal = src[key];
      const targetVal = tgt[key];

      if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
        const merged = Object.assign({}, targetVal);
        tgt[key] = merged;
        stack.push([merged, sourceVal]);
      } else {
        tgt[key] = sourceVal;
      }
    }
  }

  return result;
}

export { deepMerge };
