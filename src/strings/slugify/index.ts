import type { SlugifyParams, SlugifyResult } from "./types.js";

function slugify({ str }: SlugifyParams): SlugifyResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { slugify };
