import type { CapitalizeParams, CapitalizeResult } from "./types.js";

function capitalize({
  str,
  preserveRest = false,
}: CapitalizeParams): CapitalizeResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (str.length === 0) return "";

  if (preserveRest) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const lowered = str.toLowerCase();
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

export { capitalize };
