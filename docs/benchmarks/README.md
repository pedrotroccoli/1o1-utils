# Benchmarks

Performance comparison of 1o1-utils against lodash, radash, and native JavaScript.

Run `pnpm bench` to reproduce these results locally.

---

## Results

- [arrayToHash / keyBy](./array-to-hash.md) — on par with lodash
- [chunk](./chunk.md) — **1.4–11.3× faster** than lodash
- [cloneDeep](./clone-deep.md) — **2.6–4.1× faster** than lodash
- [deburr](./deburr.md)
- [defaultsDeep](./defaults-deep.md) — **3.6–5.9× faster** than lodash
- [defaults](./defaults.md) — **1.5× faster** than lodash
- [groupBy](./group-by.md) — **1.2× faster** than lodash
- [isEmpty](./is-empty.md) — on par with lodash
- [mapKeys](./map-keys.md) — 1.2× slower than lodash
- [mapValues](./map-values.md) — on par with lodash
- [normalizeEmail](./normalize-email.md)
- [omit](./omit.md) — **2.2–2.8× faster** than lodash
- [pick](./pick.md) — **2.6–4.0× faster** than lodash
- [retry](./retry.md)
- [sleep](./sleep.md)
- [sortBy](./sortby.md) — **1.7–2.3× faster** than lodash
- [transformCase](./transform-case.md)
- [unique (by key)](./unique.md) — **2.7× faster** than lodash
- [unzip](./unzip.md) — **2.3–4.0× faster** than lodash
- [zip](./zip.md) — on par with lodash

---

## Summary

| Utility | vs lodash | vs radash | vs native |
| ------- | --------- | --------- | --------- |
| arrayToHash / keyBy | on par | on par | on par |
| chunk | **4.9× faster** | on par | on par |
| cloneDeep | **3.2× faster** | 2.8× slower | — |
| deburr | — | — | on par |
| defaultsDeep | **4.8× faster** | — | — |
| defaults | **1.6× faster** | — | **2.1× faster** |
| groupBy | **1.3× faster** | on par | 1.1× slower |
| isEmpty | on par | **6.3× faster** | — |
| mapKeys | 1.2× slower | — | **1.5× faster** |
| mapValues | on par | — | **2.8× faster** |
| normalizeEmail | — | — | on par |
| omit | **2.5× faster** | 1.4× slower | — |
| pick | **3.3× faster** | on par | — |
| retry | — | **1.5× faster** | 1.3× slower |
| sleep | — | on par | on par |
| sortBy | **1.9× faster** | 1.5× slower | on par |
| transformCase | — | — | — |
| unique (by key) | **2.7× faster** | **1.6× faster** | on par |
| unzip | **3.2× faster** | — | 1.6× slower |
| zip | **1.5× faster** | **1.8× faster** | 1.2× slower |

---

## Environment

- **Machine**: arm64
- **Runtime**: Node.js v25.2.1
- **OS**: darwin 24.3.0
- **Benchmark tool**: tinybench v6
- **Date**: 2026-05-03
- **Source**: [`src/**/*.bench.ts`](../src/)
