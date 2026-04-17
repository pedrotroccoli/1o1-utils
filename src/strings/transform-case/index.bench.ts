import lodashCamelCase from "lodash/camelCase.js";
import lodashKebabCase from "lodash/kebabCase.js";
import lodashSnakeCase from "lodash/snakeCase.js";
import lodashStartCase from "lodash/startCase.js";
import { Bench } from "tinybench";
import { transformCase } from "./index.js";

const short = "helloWorld";
const medium = "myComponentNameWithMultipleWords";
const long = "thisIsAVeryLongCamelCaseIdentifierThatKeepsGoingAndGoing".repeat(
  5,
);

const bench = new Bench({ name: "transformCase", time: 1000 });

// camel -> kebab
bench
  .add("1o1-utils camel→kebab (short)", () => {
    transformCase({ str: short, to: "kebab" });
  })
  .add("lodash kebabCase (short)", () => {
    lodashKebabCase(short);
  });

bench
  .add("1o1-utils camel→kebab (medium)", () => {
    transformCase({ str: medium, to: "kebab" });
  })
  .add("lodash kebabCase (medium)", () => {
    lodashKebabCase(medium);
  });

bench
  .add("1o1-utils camel→kebab (long)", () => {
    transformCase({ str: long, to: "kebab" });
  })
  .add("lodash kebabCase (long)", () => {
    lodashKebabCase(long);
  });

// kebab -> camel
const kebabShort = "hello-world";
const kebabMedium = "my-component-name-with-multiple-words";

bench
  .add("1o1-utils kebab→camel (short)", () => {
    transformCase({ str: kebabShort, to: "camel" });
  })
  .add("lodash camelCase (short)", () => {
    lodashCamelCase(kebabShort);
  });

bench
  .add("1o1-utils kebab→camel (medium)", () => {
    transformCase({ str: kebabMedium, to: "camel" });
  })
  .add("lodash camelCase (medium)", () => {
    lodashCamelCase(kebabMedium);
  });

// camel -> snake
bench
  .add("1o1-utils camel→snake (short)", () => {
    transformCase({ str: short, to: "snake" });
  })
  .add("lodash snakeCase (short)", () => {
    lodashSnakeCase(short);
  });

// camel -> title
bench
  .add("1o1-utils camel→title (short)", () => {
    transformCase({ str: short, to: "title" });
  })
  .add("lodash startCase (short)", () => {
    lodashStartCase(short);
  });

bench
  .add("1o1-utils camel→title (medium)", () => {
    transformCase({ str: medium, to: "title" });
  })
  .add("lodash startCase (medium)", () => {
    lodashStartCase(medium);
  });

// preserveAcronyms
const acronymInput = "myHTMLParserXMLConfig";
bench
  .add("1o1-utils title preserveAcronyms", () => {
    transformCase({ str: acronymInput, to: "title", preserveAcronyms: true });
  })
  .add("1o1-utils title default", () => {
    transformCase({ str: acronymInput, to: "title" });
  });

export { bench };
