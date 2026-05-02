# mapValues

[← Back to benchmarks](./README.md)

Transforms an object's values via an iteratee function. Compared against `lodash.mapValues` and a native `Object.fromEntries(Object.entries().map())` approach.

---

| Size | 1o1-utils | lodash | native | Fastest |
| ------ | ------ | ------ | ------ | ------ |
| small | 83ns · 12.0M ops/s | 83ns · 12.0M ops/s | 208ns · 4.8M ops/s | 1o1-utils · on par vs lodash |
| wide | 2.5µs · 393.4K ops/s | 2.9µs · 342.9K ops/s | 7.9µs · 126.3K ops/s | 1o1-utils · 1.1× faster vs lodash |

```mermaid
xychart-beta horizontal
  title "mapValues — ops/s at wide items"
  x-axis ["1o1-utils", "lodash", "native"]
  bar [393391, 342936, 126310]
```
