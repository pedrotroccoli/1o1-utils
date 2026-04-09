# Benchmarks

Performance comparison of 1o1-utils against lodash, radash, and native JavaScript.

Run `pnpm bench` to reproduce these results locally.

---

## Results

- [chunk](./chunk.md) — **2.5–10× faster** than lodash, on par with native
- [pick](./pick.md) — **4× faster** than lodash (flat), **2.6×** (nested)
- [unique](./unique.md) — **2.6× faster** than lodash, on par with native
- [groupBy](./group-by.md) — **1.3× faster** than lodash
- [arrayToHash](./array-to-hash.md) — 3× slower than lodash ⚠ (candidate for optimization)

---

## Summary

| Utility | vs lodash | vs radash | vs native |
|---------|-----------|-----------|-----------|
| chunk | **2.5–10× faster** | no equivalent | on par |
| pick (flat) | **4× faster** | on par | 3× slower |
| pick (nested) | **2.6× faster** | no support | — |
| unique | **2.6× faster** | **1.6× faster** | on par |
| groupBy | **1.3× faster** | ~5% slower | ~15% slower |
| arrayToHash | 3× slower ⚠ | 3× slower ⚠ | 3× slower ⚠ |

---

## Environment

- **Machine**: Apple Silicon (ARM64)
- **Runtime**: Node.js v25.2.1
- **OS**: macOS Darwin 24.3.0
- **Benchmark tool**: tinybench v6
- **Date**: 2026-04-09
- **Source**: [`src/**/*.bench.ts`](../src/)
