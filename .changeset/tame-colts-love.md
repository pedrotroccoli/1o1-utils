---
"1o1-utils": minor
---

Added `chunk` utility that splits an array into groups of a given size. Useful for batching API calls, pagination, and processing large datasets in groups.

```typescript
import { chunk } from "1o1-utils";

chunk({ array: [1, 2, 3, 4, 5], size: 2 });
// → [[1, 2], [3, 4], [5]]
```
