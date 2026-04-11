import type { IsEmptyParams } from "./types.js";

function isEmpty({ value }: IsEmptyParams): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      for (const _ in value) return false;
      return true;
    }
  }

  return false;
}

export { isEmpty };
