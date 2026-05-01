---
"1o1-utils": minor
---

Add `clamp` utility under the `numbers` category. `clamp({ value, min, max })` restricts a number to the inclusive range `[min, max]`: returns `min` if `value` is below the range, `max` if above, otherwise `value`. Bounds are swapped silently when `min > max`. Throws if any parameter is not a number or is `NaN`. Works with `Infinity` bounds and floating-point values.
