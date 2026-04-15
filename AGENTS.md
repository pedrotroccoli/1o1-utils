# AGENTS.md

## Project Overview

1o1-utils is a lightweight, tree-shakeable TypeScript utility library with zero dependencies. Each utility is independently importable. The library must stay under 5 kB gzipped total, with individual utilities at 1-2 kB.

## Commands

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Build | `pnpm build` |
| Test | `pnpm test` |
| Test + coverage | `pnpm test:coverage` |
| Lint + format check | `pnpm check` |
| Lint + format fix | `pnpm check:fix` |
| Benchmarks | `pnpm bench` |
| Bundle size check | `pnpm size` |
| Docs dev server | `pnpm docs:dev` |

Always run `pnpm check:fix` before committing. Tests require 80% minimum coverage on lines, branches, functions, and statements.

## Project Structure

```
src/
  <category>/<utility>/
    index.ts          # Implementation
    types.ts          # TypeScript types
    index.spec.ts     # Tests (Mocha + Chai)
    index.bench.ts    # Benchmarks (tinybench)
  benchmarks/
    helpers.ts        # Benchmark dataset helpers
    run.ts            # Benchmark runner
  index.ts            # All exports
website/              # Astro Starlight docs site
```

Categories: `arrays`, `async`, `objects`, `strings`.

## Code Conventions

- **Named object parameters** — all functions take a single object: `fn({ param1, param2 })`, never positional args
- **Type naming** — `<Name>Params` (input), `<Name>Result` (output), `<Name>` (function type)
- **Named exports only** — no default exports
- **Import extensions** — always use `.js` in import paths (ESM requirement)
- **Input validation** — validate parameters and throw descriptive `Error` messages
- **No external dependencies** — use only TypeScript/JS builtins
- **Immutability** — never mutate input arguments, always return new values

## Style (enforced by Biome)

- 2-space indentation
- Double quotes
- Semicolons always
- Trailing commas

## Adding a New Utility

Each utility requires changes in these files:

1. Create 4 files in `src/<category>/<util-name>/`: `index.ts`, `types.ts`, `index.spec.ts`, `index.bench.ts`
2. Add export to `src/index.ts`
3. Add subpath export to `package.json` `exports` field
4. Add entry to `.size-limit.json` (limit: 1-2 kB)
5. Add entry to `llms.txt` (link + one-line description) and `llms-full.txt` (full docs block)
6. Create documentation page at `website/src/content/docs/<category>/<util-name>.mdx`
7. Run `pnpm changeset` (minor for new utils, patch for fixes)

## Verification Checklist

```bash
pnpm check        # lint + format
pnpm test:coverage # tests + 80% coverage
pnpm build && pnpm size  # compile + bundle size limits
```
