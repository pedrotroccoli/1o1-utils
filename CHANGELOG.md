# 1o1-utils

## 1.3.0

### Minor Changes

- f443a46: Add `groupBy` utility to group array items by a given key
- d1c1f3c: Add `omit` utility for objects with nested key support via dot notation
- f877e0b: Add `pick` utility for objects with nested key support via dot notation
- cabbd39: Add `sortBy` utility for arrays with dot notation key support and numeric fast path

## 1.2.0

### Minor Changes

- 78c293a: Added `unique` utility that deduplicates an array, optionally by a specific key. Useful for removing duplicate entries from API responses, normalizing datasets, and ensuring collection uniqueness.

  ```typescript
  import { unique } from "1o1-utils";

  unique({ array: [1, 2, 2, 3] });
  // → [1, 2, 3]

  unique({ array: [{ id: 1 }, { id: 1 }, { id: 2 }], key: "id" });
  // → [{ id: 1 }, { id: 2 }]
  ```

- 7019195: Added `chunk` utility that splits an array into groups of a given size. Useful for batching API calls, pagination, and processing large datasets in groups.

  ```typescript
  import { chunk } from "1o1-utils";

  chunk({ array: [1, 2, 3, 4, 5], size: 2 });
  // → [[1, 2], [3, 4], [5]]
  ```
