import { deburr } from "../deburr/index.js";
import { escapeRegExp } from "../escape-reg-exp/index.js";
import type { SlugifyParams, SlugifyResult } from "./types.js";

/**
 * Converts a string to a URL-friendly slug.
 *
 * @param params - The parameters object
 * @param params.str - The string to slugify
 * @param params.separator - The separator to use between words (default: "-")
 * @returns A lowercase slug with non-alphanumeric runs replaced by the separator
 *
 * @example
 * ```ts
 * slugify({ str: "Hello World!" });
 * // => "hello-world"
 *
 * slugify({ str: "Hello World!", separator: "_" });
 * // => "hello_world"
 *
 * slugify({ str: "Hello World!", separator: "" });
 * // => "helloworld"
 * ```
 *
 * @keywords url slug, url friendly, permalink, dash case url, snake case slug
 *
 * @throws Error if `str` is not a string
 * @throws Error if `separator` is not a string
 */
function slugify({ str, separator = "-" }: SlugifyParams): SlugifyResult {
  if (typeof str !== "string") {
    throw new Error("The 'str' parameter must be a string");
  }

  if (typeof separator !== "string") {
    throw new Error("The 'separator' parameter must be a string");
  }

  const base = deburr({ str })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator);

  if (separator === "") {
    return base;
  }

  const escaped = escapeRegExp({ str: separator });
  const trimRe = new RegExp(`^(?:${escaped})+|(?:${escaped})+$`, "g");
  return base.replace(trimRe, "");
}

export { slugify };
