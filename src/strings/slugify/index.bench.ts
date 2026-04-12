import { Bench } from "tinybench";
import { slugify } from "./index.js";

const simple = "Hello World!";
const accented = "São Paulo é uma cidade incrível";
const heavy =
  "This is a REALLY long string with LOTS of Special!@#$%^&*() Characters and Açaí and Über and naïve words".repeat(
    10,
  );

function nativeSlugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const bench = new Bench({ name: "slugify", time: 1000 });

bench
  .add("1o1-utils (simple)", () => {
    slugify({ str: simple });
  })
  .add("native (simple)", () => {
    nativeSlugify(simple);
  });

bench
  .add("1o1-utils (accented)", () => {
    slugify({ str: accented });
  })
  .add("native (accented)", () => {
    nativeSlugify(accented);
  });

bench
  .add("1o1-utils (heavy)", () => {
    slugify({ str: heavy });
  })
  .add("native (heavy)", () => {
    nativeSlugify(heavy);
  });

export { bench };
