# mapKeys

[← Back to benchmarks](./README.md)

Transforms an object's keys via an iteratee function. Compared against `lodash.mapKeys` and a native `Object.fromEntries(Object.entries().map())` approach.

---

| Size | 1o1-utils | lodash | native | Fastest |
| ------ | ------ | ------ | ------ | ------ |
| small | 250ns · 4.0M ops/s | 209ns · 4.8M ops/s | 333ns · 3.0M ops/s | lodash · on par vs lodash |
| wide | 6.6µs · 151.9K ops/s | 5.6µs · 177.8K ops/s | 10.6µs · 94.5K ops/s | lodash · on par vs lodash |

```mermaid
xychart-beta horizontal
  title "mapKeys — ops/s at wide items"
  x-axis ["lodash", "1o1-utils", "native"]
  bar [177778, 151906, 94482]
```
