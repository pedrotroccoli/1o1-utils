import type { TruncateParams, TruncateResult } from "./types.js";

function truncate({
  str,
  length,
  suffix = "...",
}: TruncateParams): TruncateResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (typeof length !== "number" || length <= 0 || !Number.isInteger(length)) {
    throw new Error("The 'length' parameter must be a positive integer");
  }

  if (str.length <= length) {
    return str;
  }

  return str.slice(0, length) + suffix;
}

export { truncate };
