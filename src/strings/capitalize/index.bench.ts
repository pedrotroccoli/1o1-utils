import lodashCapitalize from "lodash/capitalize.js";
import { Bench } from "tinybench";
import { capitalize } from "./index.js";

const short = "hello";
const medium = "the quick brown fox jumps over the lazy dog";
const long = "lorem ipsum dolor sit amet consectetur adipiscing elit ".repeat(
  50,
);

const bench = new Bench({ name: "capitalize", time: 1000 });

bench
  .add("1o1-utils (short)", () => {
    capitalize({ str: short });
  })
  .add("lodash (short)", () => {
    lodashCapitalize(short);
  });

bench
  .add("1o1-utils (medium)", () => {
    capitalize({ str: medium });
  })
  .add("lodash (medium)", () => {
    lodashCapitalize(medium);
  });

bench
  .add("1o1-utils (long)", () => {
    capitalize({ str: long });
  })
  .add("lodash (long)", () => {
    lodashCapitalize(long);
  });

export { bench };
