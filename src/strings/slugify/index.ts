import type { SlugifyParams, SlugifyResult } from "./types.js";

/**
 * Converts a string to a URL-friendly slug.
 *
 * @param params - The parameters object
 * @param params.str - The string to slugify
 * @returns A lowercase, hyphen-separated slug
 *
 * @example
 * ```ts
 * slugify({ str: "Hello World!" });
 * // => "hello-world"
 * ```
 *
 * @throws Error if `str` is not a string
 */
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
