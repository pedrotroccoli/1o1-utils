### Description

A library of many common utilities used across many typescript & javascript projects. Feel free to open PR to add features or issues.

### Benchmarks

See [benchmarks/README.md](./benchmarks/README.md) for full results.

| Utility | vs lodash | vs radash | vs native |
| ------- | --------- | --------- | --------- |
| [arrayToHash](./benchmarks/array-to-hash.md) | on par | on par | on par |
| [chunk](./benchmarks/chunk.md) | **4.9x faster** | **1.1x faster** | on par |
| [groupBy](./benchmarks/group-by.md) | **1.3x faster** | on par | on par |
| [unique](./benchmarks/unique.md) | **2.6x faster** | **1.6x faster** | on par |
| [pick](./benchmarks/pick.md) | **3.1x faster** | on par | 3.0x slower |

> Run `pnpm bench` to reproduce locally.
