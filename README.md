<p align="center">
  <img src="https://raw.githubusercontent.com/pedrotroccoli/1o1-utils/main/website/public/logo.png" alt="1o1-utils logo" width="240">
  <h1 align="center">1o1-utils</h1>
  <p align="center">Lightweight, tree-shakeable, zero-dependency TypeScript utilities. Pay only for what you import.</p>
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

- **Tree-shakeable** — every utility ships from its own subpath; bundlers drop everything you don't import.
- **Zero dependencies** — no transitive bloat, no supply-chain risk.
- **TypeScript-first** — full type inference and strict null safety out of the box.
- **Tiny per-utility footprint** — most utilities are **150–500 B brotlied**; the largest is ~1.2 kB.
- **Benchmarked** — measured against lodash, radash, es-toolkit, and native JavaScript — up to 11× faster on the slowest competitor.
- **Interactive playground** — every utility has a "Try it" block on its docs page that runs `1o1-utils` directly from npm.

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
| `diff` | Elements in array A not in array B | `1o1-utils/diff` |
| `groupBy` | Group array items by a key | `1o1-utils/group-by` |
| `partition` | Split into `[matches, rest]` by predicate | `1o1-utils/partition` |
| `range` | Generate a numeric range as an array | `1o1-utils/range` |
| `replace` | Replace element(s) by predicate (immutable) | `1o1-utils/replace` |
| `shuffle` | Fisher-Yates shuffle (non-mutating) | `1o1-utils/shuffle` |
| `sortBy` | Sort an array by a key | `1o1-utils/sort-by` |
| `times` | Invoke `fn` N times and collect results | `1o1-utils/times` |
| `unique` | Deduplicate an array (optionally by key) | `1o1-utils/unique` |
| `unzip` | Split an array of tuples into separate arrays | `1o1-utils/unzip` |
| `zip` | Combine arrays into tuples by index | `1o1-utils/zip` |

### Numbers

| Utility | Description | Import |
| --- | --- | --- |
| `clamp` | Clamp a value to `[min, max]` | `1o1-utils/clamp` |
| `inRange` | Check if a number is in a range | `1o1-utils/in-range` |
| `randomInt` | CSPRNG random integer in a range | `1o1-utils/random-int` |

### Objects

| Utility | Description | Import |
| --- | --- | --- |
| `cloneDeep` | Deep clone (objects, arrays, Maps, Sets, etc.) | `1o1-utils/clone-deep` |
| `compact` | Remove falsy values (with `keep` exceptions) | `1o1-utils/compact` |
| `deepMerge` | Recursively merge objects | `1o1-utils/deep-merge` |
| `defaults` | Fill `undefined` keys with defaults | `1o1-utils/defaults` |
| `defaultsDeep` | Recursive `defaults` | `1o1-utils/defaults-deep` |
| `get` | Read a nested value via dot notation | `1o1-utils/get` |
| `isEmpty` | Check if a value is empty | `1o1-utils/is-empty` |
| `mapKeys` | Transform object keys via an iteratee | `1o1-utils/map-keys` |
| `mapValues` | Transform object values via an iteratee | `1o1-utils/map-values` |
| `omit` | Remove keys from an object | `1o1-utils/omit` |
| `omitBy` | Remove entries by predicate | `1o1-utils/omit-by` |
| `pick` | Extract keys from an object | `1o1-utils/pick` |
| `pickBy` | Keep entries by predicate | `1o1-utils/pick-by` |
| `set` | Set a nested value immutably via dot notation | `1o1-utils/set` |

### Strings

| Utility | Description | Import |
| --- | --- | --- |
| `capitalize` | Capitalize the first letter | `1o1-utils/capitalize` |
| `deburr` | Strip diacritics (accent-fold) | `1o1-utils/deburr` |
| `escapeRegExp` | Escape regex metacharacters | `1o1-utils/escape-reg-exp` |
| `normalizeEmail` | Trim, lowercase, optional plus-strip | `1o1-utils/normalize-email` |
| `slugify` | Convert to a URL-friendly slug | `1o1-utils/slugify` |
| `transformCase` | Change string casing (camel, snake, etc.) | `1o1-utils/transform-case` |
| `truncate` | Truncate a string with a suffix | `1o1-utils/truncate` |

### Async

| Utility | Description | Import |
| --- | --- | --- |
| `debounce` | Debounce function calls | `1o1-utils/debounce` |
| `retry` | Retry failed async operations with backoff | `1o1-utils/retry` |
| `safely` | Wrap a function to return `[error, result]` | `1o1-utils/safely` |
| `sleep` | Promise-based delay | `1o1-utils/sleep` |
| `throttle` | Throttle function calls | `1o1-utils/throttle` |
| `waitForCondition` | Poll a predicate until truthy or timeout | `1o1-utils/wait-for-condition` |
| `withTimeout` | Race a promise against a timeout | `1o1-utils/with-timeout` |

### Comparisons

| Utility | Description | Import |
| --- | --- | --- |
| `deepEqual` | Recursive structural equality | `1o1-utils/deep-equal` |
| `isNil` | `null` or `undefined` check | `1o1-utils/is-nil` |
| `shallowEqual` | Top-level entry equality | `1o1-utils/shallow-equal` |

### Formatters

| Utility | Description | Import |
| --- | --- | --- |
| `secondsToTimeFormat` | Format seconds as `MM:SS` / `H:MM:SS` | `1o1-utils/seconds-to-time-format` |
| `timeFormatToSeconds` | Parse `MM:SS` / `H:MM:SS` into seconds | `1o1-utils/time-format-to-seconds` |

### Functions

| Utility | Description | Import |
| --- | --- | --- |
| `memo` | Memoize a function with optional TTL | `1o1-utils/memo` |
| `once` | Run only once, cache the first result | `1o1-utils/once` |
| `pipe` | Compose functions left-to-right | `1o1-utils/pipe` |

### Validators

| Utility | Description | Import |
| --- | --- | --- |
| `isValidEmail` | HTML5 + RFC 5321 email check | `1o1-utils/is-valid-email` |
| `isValidPhone` | E.164 international phone check | `1o1-utils/is-valid-phone` |
| `isValidUrl` | WHATWG `URL` parseable check | `1o1-utils/is-valid-url` |

### Browser

| Utility | Description | Import |
| --- | --- | --- |
| `bindKey` | Keyboard shortcuts (combos + sequences) | `1o1-utils/bind-key` |
| `copyToClipboard` | Clipboard API + `execCommand` fallback | `1o1-utils/copy-to-clipboard` |

## Bundle size

Run `pnpm size` to see per-utility brotli sizes locally. Sample from the latest release:

| Utility | Brotli size |
| --- | --- |
| `isNil` | 36 B |
| `clamp` | 150 B |
| `chunk` | 199 B |
| `deepEqual` | 590 B |
| `bindKey` | 1.05 kB |
| `isValidPhone` | 1.19 kB |
| **Whole library (all utilities)** | **~9.2 kB brotli / ~11 kB gzipped** |

Tree-shaking removes everything you don't import — typical real-world bundles add a few hundred bytes per utility, not the whole 9 kB.

## Benchmarks

All utilities are benchmarked against lodash, radash, es-toolkit, and native JavaScript.

| Utility | vs lodash | vs radash | vs native |
| --- | --- | --- | --- |
| arrayToHash / keyBy | on par | on par | on par |
| chunk | **4.9× faster** | on par | on par |
| groupBy | **1.3× faster** | on par | 1.1× slower |
| unique (by key) | **2.7× faster** | **1.6× faster** | on par |
| pick | **3.3× faster** | on par | — |

> Run `pnpm bench` to reproduce locally. See [full benchmark results](./docs/benchmarks/README.md).

## Documentation

Full API reference, interactive playground, and migration guides at **[pedrotroccoli.github.io/1o1-utils](https://pedrotroccoli.github.io/1o1-utils)**.

Every utility page includes a **Try it** block — Sandpack-powered, runs `1o1-utils` straight from npm in your browser. No install needed to experiment.

## Contributing

Contributions are welcome! Check out the [Contributing Guide](./CONTRIBUTING.md) to get started.

## License

[MIT](./LICENSE) — Pedro Troccoli
