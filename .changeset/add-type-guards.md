---
"1o1-utils": minor
---

Add `type-guards` category with `isString`, `isNumber`, and `isNullish`. Each utility is a TypeScript type predicate (`value is string`, `value is number`, `value is null | undefined`) so callers can narrow `unknown` values inside `if`/`else` branches. Type guards use a single positional argument — the library's named-object convention prevents the predicate from narrowing the caller's variable, so this category intentionally takes the value directly.
