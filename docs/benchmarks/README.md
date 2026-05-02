# Benchmarks

Performance comparison of 1o1-utils against lodash, radash, and native JavaScript.

Run `pnpm bench` to reproduce these results locally.

---

## Results

- [arrayToHash / keyBy](./array-to-hash.md) — on par with lodash
- [chunk](./chunk.md) — **1.4–11.4× faster** than lodash
- [defaults](./defaults.md) — **1.5–1.8× faster** than lodash
- [defaultsDeep](./defaults-deep.md) — **3.7–5.9× faster** than lodash
- [groupBy](./group-by.md) — **1.2× faster** than lodash
- [mapKeys](./map-keys.md) — on par with lodash
- [mapValues](./map-values.md) — on par with lodash
- [unique (by key)](./unique.md) — **2.7× faster** than lodash
- [pick](./pick.md) — **2.6–4.0× faster** than lodash

---

## Summary

| Utility | vs lodash | vs radash | vs native |
| ------- | --------- | --------- | --------- |
| arrayToHash / keyBy | on par | on par | on par |
| chunk | **4.9× faster** | on par | on par |
| defaults | **1.6× faster** | — | **2.1× faster** |
| defaultsDeep | **4.8× faster** | — | — |
| groupBy | **1.3× faster** | on par | 1.1× slower |
| mapKeys | on par | — | **1.4× faster** |
| mapValues | **1.1× faster** | — | **2.7× faster** |
| unique (by key) | **2.7× faster** | **1.6× faster** | on par |
| pick | **3.3× faster** | on par | — |

---

## Environment

- **Machine**: arm64
- **Runtime**: Node.js v25.2.1
- **OS**: darwin 24.3.0
- **Benchmark tool**: tinybench v6
- **Date**: 2026-04-09
- **Source**: [`src/**/*.bench.ts`](../src/)
