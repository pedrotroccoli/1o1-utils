# Contributing to 1o1-utils

Thanks for your interest in contributing! This guide covers everything you need to add a new utility or improve an existing one.

## Getting Started

```bash
git clone https://github.com/pedrotroccoli/1o1-utils.git
cd 1o1-utils
pnpm install
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm test` | Run tests |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm build` | Compile TypeScript |
| `pnpm check` | Lint + format check (Biome) |
| `pnpm check:fix` | Lint + format auto-fix |
| `pnpm bench` | Run all benchmarks |
| `pnpm size` | Check bundle sizes |

## Adding a New Utility

### 1. Create the folder

```
src/<category>/<util-name>/
```

Categories: `arrays`, `async`, `browser`, `comparisons`, `formatters`, `functions`, `numbers`, `objects`, `strings`, `validators`. Use kebab-case for the folder name.

### 2. Create the files

Every utility has exactly 4 files:

#### `types.ts` — Type definitions

```ts
interface MyUtilParams {
  // named parameters
}

type MyUtilResult = // return type

type MyUtil = (params: MyUtilParams) => MyUtilResult;

export type { MyUtil, MyUtilParams, MyUtilResult };
```

#### `index.ts` — Implementation

```ts
import type { MyUtilParams, MyUtilResult } from "./types.js";

/**
 * Brief description of what this utility does.
 *
 * @keywords common term 1, common term 2, common term 3
 * @see RFC/Standard reference if applicable (https://...)
 */
function myUtil({ param1, param2 }: MyUtilParams): MyUtilResult {
  // validate inputs
  // implementation
}

export { myUtil };
```

#### `index.spec.ts` — Tests

```ts
import { expect } from "chai";
import { describe, it } from "mocha";
import { myUtil } from "./index.js";

describe("myUtil", () => {
  it("should do the expected thing", () => {
    const result = myUtil({ param1: "value" });
    expect(result).to.deep.equal(/* expected */);
  });

  it("should throw on invalid input", () => {
    expect(() => myUtil({ param1: "" })).to.throw("descriptive error");
  });
});
```

#### `index.bench.ts` — Benchmarks

```ts
import { Bench } from "tinybench";
import { getDatasets } from "../../benchmarks/helpers.js";
import { myUtil } from "./index.js";
// import lodash/radash equivalents

const bench = new Bench({ name: "myUtil", time: 1000 });

for (const { name, data: getData } of getDatasets()) {
  const data = getData();
  bench
    .add(`1o1-utils (${name})`, () => { myUtil({ /* ... */ }); })
    .add(`lodash (${name})`, () => { /* lodash equivalent */ })
    .add(`native (${name})`, () => { /* native equivalent */ });
}

export { bench };
```

### 3. Register the export in `src/index.ts`

```ts
export { myUtil } from "./<category>/my-util/index.js";
```

### 4. Add the export entry in `package.json`

```json
"./my-util": {
  "import": "./dist/<category>/my-util/index.js",
  "types": "./dist/<category>/my-util/index.d.ts"
}
```

### 5. Add a size-limit entry in `.size-limit.json`

```json
{
  "name": "my-util",
  "path": "dist/<category>/my-util/index.js",
  "limit": "1 kB"
}
```

Most utilities fit in 1 kB. Use 2 kB only if needed.

### 6. Update `llms.txt` and `llms-full.txt`

Add the new utility to both files at the root of the repository:

- **`llms.txt`** — add a link entry under the appropriate category section:
  ```
  - [myUtil](https://pedrotroccoli.github.io/1o1-utils/<category>/my-util/): One-line description
  ```

- **`llms-full.txt`** — add a full documentation block under the appropriate category section with: signature, parameters, return type, example, and throws/edge cases.

These files are symlinked into `website/public/` and served on the docs site for AI tool discoverability.

### 7. Add a playground example

The docs site ships an interactive playground (`/playground/`) plus a per-utility `## Try it` block embedded on every utility page. Both are powered by the same Sandpack-based component. Adding a new utility means contributing one example.

#### 7a. Register the example

Edit `website/src/content/examples/index.ts` and append an `Example` entry to the `EXAMPLES` array:

```ts
{
  id: "my-util",          // kebab-case, must match the doc page slug
  label: "myUtil",        // shown in the playground selector
  category: "Arrays",     // Arrays | Objects | Numbers | Strings | Async | Validators | Comparisons | Functions
  code: `import { myUtil } from "1o1-utils/my-util";

const result = myUtil({ /* params */ });

console.log(result);
`,
},
```

Guidelines for the snippet:

- Use the **published API** (object-param form), not internals.
- Keep it under ~15 lines so it fits the editor without scrolling.
- Print output via `console.log` — the playground console panel renders it.
- Avoid `import` from the bare `1o1-utils` entry; use the per-utility subpath (`1o1-utils/my-util`) so users see the tree-shakeable import.
- Use `await` at the top level for async utilities (Sandpack's `vanilla-ts` template supports it).

#### 7b. Embed the playground in the doc page

Add the import + a `## Try it` section near the top of `website/src/content/docs/<category>/<my-util>.mdx`, right after the frontmatter and the one-line summary:

```mdx
---
title: myUtil
description: Brief description
---

import Playground from "../../../components/Playground.tsx";

Brief one-paragraph summary of what the utility does.

## Try it

<Playground client:only="react" utilityId="my-util" />

## Import
...
```

The `utilityId` value **must** match the `id` in `EXAMPLES`. The path `../../../components/Playground.tsx` is correct for any `docs/<category>/<file>.mdx` page.

#### 7c. Verify locally

```bash
pnpm docs:dev
```

Open `http://localhost:4321/1o1-utils/<category>/<my-util>/` and confirm the playground:

1. Loads (Sandpack fetches `1o1-utils` from the CDN — first load takes a few seconds).
2. Runs the snippet without throwing.
3. Prints the expected output to the console panel.

Also check `/playground/` — your example should appear in the selector under its category.

### 8. Create a changeset

```bash
pnpm changeset
```

Choose `minor` for new utilities, `patch` for bug fixes. See [docs/changesets.md](./docs/changesets.md) for details.

## Code Conventions

- **Named object parameters** — all functions take a single object, never positional args. Exception: function composition utilities (`pipe`, `once`) may use positional/variadic args when it's the idiomatic pattern.
- **Type naming** — `<Name>Params`, `<Name>Result`, `<Name>` (function type)
- **No external dependencies** — use only TypeScript/JS builtins
- **Import extensions** — always use `.js` in import paths (required for ESM)
- **Input validation** — validate parameters and throw descriptive errors. Exception: checker functions (`isNil`, `isCircular`, `isEmpty`) return `false` instead of throwing; `safely` returns a `[error, result]` tuple; `get` returns `undefined` or a default value.
- **Named exports only** — no default exports
- **Immutability** — all array/object utils must return new instances, never mutate inputs

### Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Boolean checks | `isX` | `isNil`, `isEmpty`, `isCircular` |
| Validators | `isValidX` | `isValidUrl`, `isValidEmail` |
| Conversions | `toX` | `toNumber` |
| Formatters | `formatX` | `formatSeconds` |
| Generators | `generateX` | `generateString` |
| Normalizers | `normalizeX` | `normalizeEmail` |
| No type suffix | Don't add the type to the name | `clamp` not `clampNumber`, `capitalize` not `capitalizeString` |

### Discoverability (mandatory)

Every utility **must** include:

1. **`@keywords` in JSDoc** — common-language terms developers might search for:
   ```ts
   /**
    * Clamps a number between a minimum and maximum bound.
    *
    * @keywords limit number, restrict range, min max, bound
    */
   ```

2. **`@see` in JSDoc** — RFC or standard reference, if the util aligns with one:
   ```ts
   /**
    * @see RFC 5321 — SMTP (https://datatracker.ietf.org/doc/html/rfc5321)
    */
   ```

3. **"Also known as"** on the docs page — alternative names for the same concept:
   > **Also known as:** limit number, restrict range, min/max bound

4. **"Prompt suggestion"** on the docs page — a ready-to-copy prompt for AI assistants:
   > **Prompt suggestion:** `Show me how to use clamp from 1o1-utils to restrict a slider value between min and max`

### Style (enforced by Biome)

- 2-space indentation
- Double quotes
- Semicolons always
- Trailing commas

Run `pnpm check:fix` before committing to auto-fix formatting.

## Testing

- Framework: **Mocha** + **Chai**
- Coverage: **c8** with **80% minimum** on lines, branches, functions, and statements
- Test files: `src/**/*.spec.ts`

Cover happy paths, edge cases, and error cases.

## Benchmarks

- Framework: **tinybench**
- Compare against: lodash, radash, and native JS
- Test with multiple dataset sizes using `getDatasets()` helper

## Bundle Size

Each utility must stay under its size limit (1-2 kB gzipped). Run `pnpm size` to verify. The total library limit is 5 kB.

## Pull Request Checklist

- [ ] All 4 files created (`index.ts`, `types.ts`, `index.spec.ts`, `index.bench.ts`)
- [ ] Export added to `src/index.ts`
- [ ] Export entry added to `package.json`
- [ ] Size-limit entry added to `.size-limit.json`
- [ ] Utility added to `llms.txt` and `llms-full.txt`
- [ ] Playground example added to `website/src/content/examples/index.ts`
- [ ] `## Try it` block with `<Playground utilityId="..." />` embedded in the docs page
- [ ] Playground verified locally via `pnpm docs:dev`
- [ ] `@keywords` added to JSDoc
- [ ] `@see` RFC/standard reference added (if applicable)
- [ ] "Also known as" section added to docs page
- [ ] "Prompt suggestion" section added to docs page
- [ ] `pnpm check` passes
- [ ] `pnpm test` passes with >80% coverage
- [ ] `pnpm build && pnpm size` passes
- [ ] Changeset created
