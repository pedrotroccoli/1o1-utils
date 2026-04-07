# Changesets

This project uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

## Adding a changeset

Every PR that changes functionality should include a changeset. Run:

```bash
pnpm changeset
```

You'll be prompted to:

1. **Select the package** — choose `1o1-utils`
2. **Pick the bump type** — `patch`, `minor`, or `major`
3. **Write a summary** — describe the change for the CHANGELOG

This creates a markdown file in `.changeset/`. Commit it with your PR.

## Bump types

| Type    | When to use                                      | Example                        |
| ------- | ------------------------------------------------ | ------------------------------ |
| `patch` | Bug fixes, internal refactors                    | Fix `arrayToHash` edge case    |
| `minor` | New utilities, new features                      | Add `pick` utility             |
| `major` | Breaking changes to existing APIs                | Change `arrayToHash` signature |

## What happens after merge

1. CI detects pending changesets on `main`
2. A **"Version Packages"** PR is automatically opened — it bumps `version` in `package.json` and updates `CHANGELOG.md`
3. When that PR is merged, the package is **published to npm** automatically

## When NOT to add a changeset

- Docs-only changes
- CI/tooling changes
- Test-only changes

These don't affect the published package, so no version bump is needed.
