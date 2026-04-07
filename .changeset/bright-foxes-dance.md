---
"1o1-utils": minor
---

Added `unique` utility that deduplicates an array, optionally by a specific key. Useful for removing duplicate entries from API responses, normalizing datasets, and ensuring collection uniqueness.

```typescript
import { unique } from "1o1-utils";

unique({ array: [1, 2, 2, 3] });
// → [1, 2, 3]

unique({ array: [{ id: 1 }, { id: 1 }, { id: 2 }], key: "id" });
// → [{ id: 1 }, { id: 2 }]
```
