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

Categories: `arrays`, `async`, `objects`, `strings`. Use kebab-case for the folder name.

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

### 7. Create a changeset

```bash
pnpm changeset
```

Choose `minor` for new utilities, `patch` for bug fixes. See [docs/changesets.md](./docs/changesets.md) for details.

## Code Conventions

- **Named object parameters** — all functions take a single object, never positional args
- **Type naming** — `<Name>Params`, `<Name>Result`, `<Name>` (function type)
- **No external dependencies** — use only TypeScript/JS builtins
- **Import extensions** — always use `.js` in import paths (required for ESM)
- **Input validation** — validate parameters and throw descriptive errors
- **Named exports only** — no default exports

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
- [ ] `pnpm check` passes
- [ ] `pnpm test` passes with >80% coverage
- [ ] `pnpm build && pnpm size` passes
- [ ] Changeset created
