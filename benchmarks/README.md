# Benchmarks

Performance comparison of 1o1-utils against lodash, radash, and native JavaScript.

Run `pnpm bench` to reproduce these results locally.

---

## Results

- [arrayToHash / keyBy](./array-to-hash.md) — on par with lodash
- [chunk](./chunk.md) — **1.4–11.7× faster** than lodash
- [groupBy](./group-by.md) — **1.3× faster** than lodash
- [unique (by key)](./unique.md) — **2.6× faster** than lodash
- [pick](./pick.md) — **2.6–3.7× faster** than lodash

---

## Summary

| Utility | vs lodash | vs radash | vs native |
| ------- | --------- | --------- | --------- |
| arrayToHash / keyBy | on par | 1.1× slower | on par |
| chunk | **4.9× faster** | **1.1× faster** | on par |
| groupBy | **1.3× faster** | on par | 1.1× slower |
| unique (by key) | **2.6× faster** | **1.6× faster** | on par |
| pick | **3.1× faster** | on par | 3.0× slower |

---

## Environment

- **Machine**: arm64
- **Runtime**: Node.js v25.2.1
- **OS**: darwin 24.3.0
- **Benchmark tool**: tinybench v6
- **Date**: 2026-04-09
- **Source**: [`src/**/*.bench.ts`](../src/)
