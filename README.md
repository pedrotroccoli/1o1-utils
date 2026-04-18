<p align="center">
  <img src="https://raw.githubusercontent.com/pedrotroccoli/1o1-utils/main/website/public/logo.png" alt="1o1-utils logo" width="240">
  <h1 align="center">1o1-utils</h1>
  <p align="center">Lightweight, fastest, tree-shakeable TypeScript utilities. 2 kB gzipped.</p>
</p>

<p align="center">
  <a href="https://github.com/pedrotroccoli/1o1-utils/actions/workflows/ci.yml"><img src="https://github.com/pedrotroccoli/1o1-utils/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/1o1-utils"><img src="https://img.shields.io/npm/v/1o1-utils" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/1o1-utils"><img src="https://img.shields.io/bundlephobia/minzip/1o1-utils" alt="bundle size"></a>
  <a href="https://github.com/pedrotroccoli/1o1-utils/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/1o1-utils" alt="license"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/pedrotroccoli/1o1-utils"><img src="https://api.scorecard.dev/projects/github.com/pedrotroccoli/1o1-utils/badge" alt="OpenSSF Scorecard"></a>
</p>

---

## Features

- **Tree-shakeable** — import only what you use, each utility is independently importable
- **Zero dependencies** — no bloat, no supply-chain risk
- **TypeScript-first** — full type inference out of the box
- **Benchmarked** — tested against lodash, radash, and native JS — up to 11× faster

## Install

```bash
pnpm add 1o1-utils
```

```bash
npm install 1o1-utils
```

```bash
yarn add 1o1-utils
```

## Usage

Import everything from the main entry:

```ts
import { chunk, pick, slugify, retry } from "1o1-utils";
```

Or import individual modules for minimal bundles:

```ts
import { chunk } from "1o1-utils/chunk";
import { pick } from "1o1-utils/pick";
```

## Utilities

### Arrays

| Utility | Description | Import |
| --- | --- | --- |
| `arrayToHash` | Convert an array to a keyed object | `1o1-utils/array-to-hash` |
| `chunk` | Split an array into fixed-size chunks | `1o1-utils/chunk` |
| `groupBy` | Group array items by a key | `1o1-utils/group-by` |
| `sortBy` | Sort an array by a key | `1o1-utils/sort-by` |
| `unique` | Deduplicate an array by a key | `1o1-utils/unique` |

### Objects

| Utility | Description | Import |
| --- | --- | --- |
| `cloneDeep` | Deep clone objects, arrays, Maps, Sets, etc. | `1o1-utils/clone-deep` |
| `deepMerge` | Recursively merge objects | `1o1-utils/deep-merge` |
| `get` | Read a nested value via dot notation | `1o1-utils/get` |
| `isEmpty` | Check if a value is empty | `1o1-utils/is-empty` |
| `omit` | Remove keys from an object | `1o1-utils/omit` |
| `pick` | Extract keys from an object | `1o1-utils/pick` |
| `set` | Set a nested value immutably via dot notation | `1o1-utils/set` |

### Strings

| Utility | Description | Import |
| --- | --- | --- |
| `capitalize` | Capitalize the first letter | `1o1-utils/capitalize` |
| `slugify` | Convert to a URL-friendly slug | `1o1-utils/slugify` |
| `transformCase` | Change string casing (camel, snake, etc.) | `1o1-utils/transform-case` |
| `truncate` | Truncate a string with a suffix | `1o1-utils/truncate` |

### Async

| Utility | Description | Import |
| --- | --- | --- |
| `debounce` | Debounce function calls | `1o1-utils/debounce` |
| `retry` | Retry failed async operations | `1o1-utils/retry` |
| `sleep` | Promise-based delay | `1o1-utils/sleep` |
| `throttle` | Throttle function calls | `1o1-utils/throttle` |

## Benchmarks

All utilities are benchmarked against lodash, radash, and native JavaScript.

| Utility | vs lodash | vs radash | vs native |
| --- | --- | --- | --- |
| arrayToHash / keyBy | on par | on par | on par |
| chunk | **4.9× faster** | on par | on par |
| groupBy | **1.3× faster** | on par | 1.1× slower |
| unique (by key) | **2.7× faster** | **1.6× faster** | on par |
| pick | **3.3× faster** | on par | — |

> Run `pnpm bench` to reproduce locally. See [full benchmark results](./docs/benchmarks/README.md).

## Documentation

Full API reference and guides available at **[pedrotroccoli.github.io/1o1-utils](https://pedrotroccoli.github.io/1o1-utils)**.

## Contributing

Contributions are welcome! Check out the [Contributing Guide](./CONTRIBUTING.md) to get started.

## License

[MIT](./LICENSE) — Pedro Troccoli
