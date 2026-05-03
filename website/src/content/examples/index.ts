export type Example = {
  id: string;
  label: string;
  category: string;
  code: string;
};

export const EXAMPLES: Example[] = [
  // ============ Arrays ============
  {
    id: "array-to-hash",
    label: "arrayToHash",
    category: "Arrays",
    code: `import { arrayToHash } from "1o1-utils/array-to-hash";

const users = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Cleo" },
];

console.log(arrayToHash({ array: users, key: "id" }));
// { "1": { id: 1, name: "Ada" }, ... }
`,
  },
  {
    id: "chunk",
    label: "chunk",
    category: "Arrays",
    code: `import { chunk } from "1o1-utils/chunk";

console.log(chunk({ array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], size: 3 }));
// [[1,2,3],[4,5,6],[7,8,9],[10]]
`,
  },
  {
    id: "diff",
    label: "diff",
    category: "Arrays",
    code: `import { diff } from "1o1-utils/diff";

console.log(diff({ array: [1, 2, 3, 4], values: [2, 4] }));
// [1, 3]

const a = [{ id: 1 }, { id: 2 }, { id: 3 }];
const b = [{ id: 2 }];
console.log(diff({ array: a, values: b, iteratee: (x) => x.id }));
`,
  },
  {
    id: "group-by",
    label: "groupBy",
    category: "Arrays",
    code: `import { groupBy } from "1o1-utils/group-by";

const users = [
  { id: 1, role: "admin", name: "Ada" },
  { id: 2, role: "user", name: "Bob" },
  { id: 3, role: "admin", name: "Cleo" },
];

console.log(groupBy({ array: users, key: "role" }));
`,
  },
  {
    id: "partition",
    label: "partition",
    category: "Arrays",
    code: `import { partition } from "1o1-utils/partition";

const [evens, odds] = partition({
  array: [1, 2, 3, 4, 5, 6],
  predicate: (n) => n % 2 === 0,
});

console.log({ evens, odds });
`,
  },
  {
    id: "range",
    label: "range",
    category: "Arrays",
    code: `import { range } from "1o1-utils/range";

console.log(range({ end: 5 }));
// [0, 1, 2, 3, 4]

console.log(range({ start: 1, end: 10, step: 2 }));
// [1, 3, 5, 7, 9]
`,
  },
  {
    id: "replace",
    label: "replace",
    category: "Arrays",
    code: `import { replace } from "1o1-utils/replace";

const items = [
  { id: 1, name: "Ada", role: "user" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Cleo", role: "user" },
];

console.log(
  replace({
    array: items,
    predicate: (u) => u.id === 2,
    value: { id: 2, name: "Bob", role: "admin" },
  })
);
`,
  },
  {
    id: "shuffle",
    label: "shuffle",
    category: "Arrays",
    code: `import { shuffle } from "1o1-utils/shuffle";

console.log(shuffle({ array: [1, 2, 3, 4, 5] }));
`,
  },
  {
    id: "sort-by",
    label: "sortBy",
    category: "Arrays",
    code: `import { sortBy } from "1o1-utils/sort-by";

const users = [
  { name: "Bob", age: 30 },
  { name: "Ada", age: 25 },
  { name: "Cleo", age: 35 },
];

console.log(sortBy({ array: users, key: "age" }));
console.log(sortBy({ array: users, key: "age", order: "desc" }));
`,
  },
  {
    id: "times",
    label: "times",
    category: "Arrays",
    code: `import { times } from "1o1-utils/times";

console.log(times({ count: 5, fn: (i) => i * i }));
// [0, 1, 4, 9, 16]
`,
  },
  {
    id: "unique",
    label: "unique",
    category: "Arrays",
    code: `import { unique } from "1o1-utils/unique";

console.log(unique({ array: [1, 2, 2, 3, 3, 3, 4] }));

const users = [
  { id: 1, name: "Ada" },
  { id: 1, name: "Ada (dup)" },
  { id: 2, name: "Bob" },
];
console.log(unique({ array: users, key: "id" }));
`,
  },
  {
    id: "unzip",
    label: "unzip",
    category: "Arrays",
    code: `import { unzip } from "1o1-utils/unzip";

console.log(
  unzip({
    array: [
      [1, "a", true],
      [2, "b", false],
      [3, "c", true],
    ],
  })
);
// [[1,2,3], ["a","b","c"], [true,false,true]]
`,
  },
  {
    id: "zip",
    label: "zip",
    category: "Arrays",
    code: `import { zip } from "1o1-utils/zip";

console.log(
  zip({
    arrays: [
      [1, 2, 3],
      ["a", "b", "c"],
      [true, false, true],
    ],
  })
);
// [[1,"a",true],[2,"b",false],[3,"c",true]]
`,
  },

  // ============ Numbers ============
  {
    id: "clamp",
    label: "clamp",
    category: "Numbers",
    code: `import { clamp } from "1o1-utils/clamp";

console.log(clamp({ value: 15, min: 0, max: 10 })); // 10
console.log(clamp({ value: -5, min: 0, max: 10 })); // 0
console.log(clamp({ value: 7, min: 0, max: 10 })); // 7
`,
  },
  {
    id: "in-range",
    label: "inRange",
    category: "Numbers",
    code: `import { inRange } from "1o1-utils/in-range";

console.log(inRange({ value: 5, start: 0, end: 10 })); // true
console.log(inRange({ value: 10, start: 0, end: 10 })); // false (end exclusive)
console.log(inRange({ value: -1, start: 0, end: 10 })); // false
`,
  },
  {
    id: "random-int",
    label: "randomInt",
    category: "Numbers",
    code: `import { randomInt } from "1o1-utils/random-int";

for (let i = 0; i < 5; i++) {
  console.log(randomInt({ min: 1, max: 100 }));
}
`,
  },

  // ============ Objects ============
  {
    id: "clone-deep",
    label: "cloneDeep",
    category: "Objects",
    code: `import { cloneDeep } from "1o1-utils/clone-deep";

const original = {
  user: { name: "Ada", tags: ["admin"] },
  date: new Date(),
};

const copy = cloneDeep({ value: original });
copy.user.tags.push("editor");

console.log({ original: original.user.tags, copy: copy.user.tags });
`,
  },
  {
    id: "compact",
    label: "compact",
    category: "Objects",
    code: `import { compact } from "1o1-utils/compact";

const data = {
  name: "Ada",
  email: "",
  age: 0,
  bio: null,
  active: true,
};

console.log(compact({ obj: data }));
// removes falsy values by default
`,
  },
  {
    id: "deep-merge",
    label: "deepMerge",
    category: "Objects",
    code: `import { deepMerge } from "1o1-utils/deep-merge";

const target = { theme: { color: "blue", size: "md" }, debug: false };
const source = { theme: { color: "red" }, debug: true };

console.log(deepMerge({ target, source }));
`,
  },
  {
    id: "defaults",
    label: "defaults",
    category: "Objects",
    code: `import { defaults } from "1o1-utils/defaults";

const config = { port: 3000 };
const defaults_ = { port: 8080, host: "localhost", debug: false };

console.log(defaults({ target: config, source: defaults_ }));
// { port: 3000, host: "localhost", debug: false }
`,
  },
  {
    id: "defaults-deep",
    label: "defaultsDeep",
    category: "Objects",
    code: `import { defaultsDeep } from "1o1-utils/defaults-deep";

const config = { server: { port: 3000 } };
const defaults_ = { server: { port: 8080, host: "localhost" }, debug: false };

console.log(defaultsDeep({ target: config, source: defaults_ }));
`,
  },
  {
    id: "get",
    label: "get",
    category: "Objects",
    code: `import { get } from "1o1-utils/get";

const data = { user: { profile: { name: "Ada" } } };

console.log(get({ obj: data, path: "user.profile.name" }));
console.log(get({ obj: data, path: "user.profile.missing", defaultValue: "fallback" }));
`,
  },
  {
    id: "is-empty",
    label: "isEmpty",
    category: "Objects",
    code: `import { isEmpty } from "1o1-utils/is-empty";

console.log(isEmpty({ value: "" })); // true
console.log(isEmpty({ value: [] })); // true
console.log(isEmpty({ value: {} })); // true
console.log(isEmpty({ value: null })); // true
console.log(isEmpty({ value: "hi" })); // false
console.log(isEmpty({ value: [1] })); // false
`,
  },
  {
    id: "map-keys",
    label: "mapKeys",
    category: "Objects",
    code: `import { mapKeys } from "1o1-utils/map-keys";

const data = { firstName: "Ada", lastName: "Lovelace" };

console.log(
  mapKeys({
    obj: data,
    iteratee: (key) => key.toUpperCase(),
  })
);
`,
  },
  {
    id: "map-values",
    label: "mapValues",
    category: "Objects",
    code: `import { mapValues } from "1o1-utils/map-values";

const scores = { ada: 90, bob: 75, cleo: 88 };

console.log(
  mapValues({
    obj: scores,
    iteratee: (v) => \`\${v}%\`,
  })
);
`,
  },
  {
    id: "omit",
    label: "omit",
    category: "Objects",
    code: `import { omit } from "1o1-utils/omit";

const user = { id: 1, name: "Ada", password: "secret", token: "xyz" };

console.log(omit({ obj: user, keys: ["password", "token"] }));
`,
  },
  {
    id: "omit-by",
    label: "omitBy",
    category: "Objects",
    code: `import { omitBy } from "1o1-utils/omit-by";

const data = { id: 1, name: "Ada", password: "secret", token: "xyz" };

console.log(
  omitBy({
    obj: data,
    predicate: (_, key) => key === "password" || key === "token",
  })
);
`,
  },
  {
    id: "pick-by",
    label: "pickBy",
    category: "Objects",
    code: `import { pickBy } from "1o1-utils/pick-by";

const data = { a: 1, b: null, c: 3, d: undefined };

console.log(pickBy({ obj: data, predicate: (v) => v != null }));
// { a: 1, c: 3 }
`,
  },
  {
    id: "pick",
    label: "pick",
    category: "Objects",
    code: `import { pick } from "1o1-utils/pick";

const user = { id: 1, name: "Ada", email: "ada@x.dev", role: "admin" };

console.log(pick({ obj: user, keys: ["id", "name"] }));
`,
  },
  {
    id: "set",
    label: "set",
    category: "Objects",
    code: `import { set } from "1o1-utils/set";

const data = { user: { profile: { name: "Ada" } } };

console.log(set({ obj: data, path: "user.profile.name", value: "Bob" }));
console.log(set({ obj: data, path: "user.profile.email", value: "bob@x.dev" }));
`,
  },

  // ============ Strings ============
  {
    id: "deburr",
    label: "deburr",
    category: "Strings",
    code: `import { deburr } from "1o1-utils/deburr";

console.log(deburr({ str: "São Paulo" }));   // "Sao Paulo"
console.log(deburr({ str: "café résumé" })); // "cafe resume"
console.log(deburr({ str: "Tiếng Việt" }));  // "Tieng Viet"
`,
  },
  {
    id: "capitalize",
    label: "capitalize",
    category: "Strings",
    code: `import { capitalize } from "1o1-utils/capitalize";

console.log(capitalize({ str: "hello world" })); // "Hello world"
console.log(capitalize({ str: "HELLO", preserveRest: true })); // "HELLO"
console.log(capitalize({ str: "HELLO" })); // "Hello"
`,
  },
  {
    id: "escape-reg-exp",
    label: "escapeRegExp",
    category: "Strings",
    code: `import { escapeRegExp } from "1o1-utils/escape-reg-exp";

const userInput = "1.5 + 2 * (3 - 1)";
const escaped = escapeRegExp({ str: userInput });

console.log(escaped);
console.log(new RegExp(escaped).test(userInput));
`,
  },
  {
    id: "normalize-email",
    label: "normalizeEmail",
    category: "Strings",
    code: `import { normalizeEmail } from "1o1-utils/normalize-email";

console.log(normalizeEmail({ email: "  Foo.Bar@Gmail.COM  " }));
console.log(normalizeEmail({ email: "user+spam@gmail.com", stripPlus: true }));
`,
  },
  {
    id: "slugify",
    label: "slugify",
    category: "Strings",
    code: `import { slugify } from "1o1-utils/slugify";

console.log(slugify({ str: "Olá Mundo! 1o1-utils é rápido" }));
// ola-mundo-1o1-utils-e-rapido
`,
  },
  {
    id: "transform-case",
    label: "transformCase",
    category: "Strings",
    code: `import { transformCase } from "1o1-utils/transform-case";

console.log(transformCase({ str: "hello world", style: "camel" }));
console.log(transformCase({ str: "hello world", style: "snake" }));
console.log(transformCase({ str: "hello world", style: "kebab" }));
console.log(transformCase({ str: "hello world", style: "pascal" }));
`,
  },
  {
    id: "truncate",
    label: "truncate",
    category: "Strings",
    code: `import { truncate } from "1o1-utils/truncate";

const text = "The quick brown fox jumps over the lazy dog";

console.log(truncate({ str: text, length: 20 }));
console.log(truncate({ str: text, length: 20, suffix: "…" }));
`,
  },

  // ============ Async ============
  {
    id: "debounce",
    label: "debounce",
    category: "Async",
    code: `import { debounce } from "1o1-utils/debounce";

const search = debounce({
  fn: (query) => console.log("searching:", query),
  ms: 200,
});

search("a");
search("ab");
search("abc");

// Only the last call fires after 200ms
`,
  },
  {
    id: "retry",
    label: "retry",
    category: "Async",
    code: `import { retry } from "1o1-utils/retry";

let attempt = 0;
const flaky = async () => {
  attempt++;
  if (attempt < 3) throw new Error("fail " + attempt);
  return "ok on attempt " + attempt;
};

console.log(await retry({ fn: flaky, attempts: 5, delay: 50 }));
`,
  },
  {
    id: "safely",
    label: "safely",
    category: "Async",
    code: `import { safely } from "1o1-utils/safely";

const safeParse = safely(JSON.parse);

const [err1, val1] = safeParse("{invalid");
console.log({ err1: err1?.message, val1 });

const [err2, val2] = safeParse('{"ok":true}');
console.log({ err2, val2 });
`,
  },
  {
    id: "sleep",
    label: "sleep",
    category: "Async",
    code: `import { sleep } from "1o1-utils/sleep";

console.log("start", new Date().toISOString());
await sleep({ ms: 500 });
console.log("end  ", new Date().toISOString());
`,
  },
  {
    id: "throttle",
    label: "throttle",
    category: "Async",
    code: `import { throttle } from "1o1-utils/throttle";

const log = throttle({
  fn: (n) => console.log("call", n, "at", Date.now() % 10000),
  ms: 100,
});

for (let i = 0; i < 5; i++) log(i);
`,
  },
  {
    id: "wait-for-condition",
    label: "waitForCondition",
    category: "Async",
    code: `import { waitForCondition } from "1o1-utils/wait-for-condition";

let ready = false;
setTimeout(() => { ready = true; }, 300);

await waitForCondition({
  condition: () => ready,
  interval: 50,
  timeout: 2000,
});

console.log("ready!");
`,
  },
  {
    id: "with-timeout",
    label: "withTimeout",
    category: "Async",
    code: `import { withTimeout } from "1o1-utils/with-timeout";
import { safely } from "1o1-utils/safely";

const slow = new Promise((resolve) => setTimeout(() => resolve("done"), 1000));

const [err, result] = await safely(() =>
  withTimeout({ promise: slow, ms: 200, message: "too slow!" })
)();

console.log({ err: err?.message, result });
`,
  },

  // ============ Comparisons ============
  {
    id: "deep-equal",
    label: "deepEqual",
    category: "Comparisons",
    code: `import { deepEqual } from "1o1-utils/deep-equal";

console.log(
  deepEqual({
    a: { user: { tags: ["a", "b"] } },
    b: { user: { tags: ["a", "b"] } },
  })
);

console.log(
  deepEqual({
    a: new Map([["x", 1]]),
    b: new Map([["x", 1]]),
  })
);
`,
  },
  {
    id: "is-nil",
    label: "isNil",
    category: "Comparisons",
    code: `import { isNil } from "1o1-utils/is-nil";

console.log(isNil({ value: null })); // true
console.log(isNil({ value: undefined })); // true
console.log(isNil({ value: 0 })); // false
console.log(isNil({ value: "" })); // false
`,
  },
  {
    id: "shallow-equal",
    label: "shallowEqual",
    category: "Comparisons",
    code: `import { shallowEqual } from "1o1-utils/shallow-equal";

console.log(shallowEqual({ a: { x: 1, y: 2 }, b: { x: 1, y: 2 } })); // true
console.log(shallowEqual({ a: [1, 2, 3], b: [1, 2, 3] })); // true
console.log(shallowEqual({ a: { x: { n: 1 } }, b: { x: { n: 1 } } })); // false (nested)
`,
  },

  // ============ Formatters ============
  {
    id: "seconds-to-time-format",
    label: "secondsToTimeFormat",
    category: "Formatters",
    code: `import { secondsToTimeFormat } from "1o1-utils/seconds-to-time-format";

console.log(secondsToTimeFormat({ seconds: 65 })); // "01:05"
console.log(secondsToTimeFormat({ seconds: 3725 })); // "1:02:05"
console.log(secondsToTimeFormat({ seconds: 3725, padHours: true })); // "01:02:05"
`,
  },
  {
    id: "time-format-to-seconds",
    label: "timeFormatToSeconds",
    category: "Formatters",
    code: `import { timeFormatToSeconds } from "1o1-utils/time-format-to-seconds";

console.log(timeFormatToSeconds({ time: "01:05" })); // 65
console.log(timeFormatToSeconds({ time: "1:02:05" })); // 3725
`,
  },

  // ============ Functions ============
  {
    id: "memo",
    label: "memo",
    category: "Functions",
    code: `import { memo } from "1o1-utils/memo";

let calls = 0;
const slow = (n) => { calls++; return n * 2; };

const fast = memo({ fn: slow });

console.log(fast(5), fast(5), fast(5));
console.log("calls:", calls); // 1
`,
  },
  {
    id: "once",
    label: "once",
    category: "Functions",
    code: `import { once } from "1o1-utils/once";

let setup = 0;
const init = once(() => { setup++; return "ready"; });

console.log(init(), init(), init());
console.log("setup ran:", setup, "times"); // 1
`,
  },
  {
    id: "pipe",
    label: "pipe",
    category: "Functions",
    code: `import { pipe } from "1o1-utils/pipe";

const slug = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\\s+/g, "-")
);

console.log(slug("  Hello World  "));
`,
  },

  // ============ Browser ============
  {
    id: "copy-to-clipboard",
    label: "copyToClipboard",
    category: "Browser",
    code: `import { copyToClipboard } from "1o1-utils/copy-to-clipboard";
import { safely } from "1o1-utils/safely";

const root = document.getElementById("root");
root.innerHTML = \`<button id="btn">Copy "1o1-utils"</button> <span id="msg"></span>\`;

document.getElementById("btn").addEventListener("click", async () => {
  const [err] = await safely(() =>
    copyToClipboard({ text: "1o1-utils" })
  )();
  document.getElementById("msg").textContent = err
    ? "failed: " + err.message
    : "copied!";
});

console.log("Click the button in the preview to copy.");
`,
  },
  {
    id: "bind-key",
    label: "bindKey",
    category: "Browser",
    code: `import { bindKey } from "1o1-utils/bind-key";

const root = document.getElementById("root");
root.innerHTML =
  '<p style="font-family:system-ui">Click here, then press <b>g i</b> or <b>ctrl+k</b>.</p><pre id="log"></pre>';
const log = document.getElementById("log");

const append = (msg) => {
  log.textContent = msg + "\\n" + log.textContent;
};

bindKey("g i", () => append("→ go to inbox (g i)"));
bindKey("ctrl+k", (e) => {
  e.preventDefault();
  append("→ command palette (ctrl+k)");
});

console.log("Bound: 'g i' and 'ctrl+k'. Focus the preview to test.");
`,
  },

  // ============ Validators ============
  {
    id: "is-valid-email",
    label: "isValidEmail",
    category: "Validators",
    code: `import { isValidEmail } from "1o1-utils/is-valid-email";

console.log(isValidEmail({ email: "ada@example.com" }));
console.log(isValidEmail({ email: "not-an-email" }));
console.log(isValidEmail({ email: "Ada <ada@example.com>", allowDisplayName: true }));
`,
  },
  {
    id: "is-valid-phone",
    label: "isValidPhone",
    category: "Validators",
    code: `import { isValidPhone } from "1o1-utils/is-valid-phone";

console.log(isValidPhone({ phone: "+1 415 555 0132" }));
console.log(isValidPhone({ phone: "(11) 91234-5678", country: "BR" }));
console.log(isValidPhone({ phone: "abc" }));
`,
  },
  {
    id: "is-valid-url",
    label: "isValidUrl",
    category: "Validators",
    code: `import { isValidUrl } from "1o1-utils/is-valid-url";

console.log(isValidUrl({ url: "https://example.com" }));
console.log(isValidUrl({ url: "ftp://files.example.com" }));
console.log(isValidUrl({ url: "ftp://files.example.com", protocols: ["http", "https"] }));
`,
  },
];

export const EXAMPLES_BY_ID: Record<string, Example> = Object.fromEntries(
  EXAMPLES.map((e) => [e.id, e])
);
