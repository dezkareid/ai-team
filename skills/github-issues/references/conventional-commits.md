# Conventional Commits for Issues

Issues use the same vocabulary as commits ([conventionalcommits.org v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)) so that an issue's type predicts the type of the commit/PR that resolves it.

## Types

| Type | Use when the work… | Typical request wording |
|---|---|---|
| `feat` | adds a new capability visible to users or consumers | "add", "support", "allow users to", "new page" |
| `fix` | corrects wrong behaviour | "bug", "broken", "crash", "doesn't work", "regression" |
| `docs` | only changes documentation | "document", "README", "AGENTS.md", "guide" |
| `style` | changes formatting/whitespace with no behaviour change | "lint formatting", "prettier", "indentation" |
| `refactor` | restructures code without changing behaviour | "clean up", "extract", "simplify", "migrate structure" |
| `perf` | improves speed, size, or resource use | "slow", "optimize", "LCP", "bundle size" |
| `test` | adds or fixes tests only | "add tests", "coverage", "flaky test" |
| `build` | changes build system or dependencies | "upgrade rollup", "bump typescript", "pnpm", "bundler" |
| `ci` | changes CI/CD configuration | "GitHub Actions", "pipeline", "workflow", "release job" |
| `chore` | maintenance not covered above | "rename repo", "housekeeping", "tooling config" |
| `revert` | reverts a previous change | "revert", "roll back #123" |

Tie-breakers:
- Bug in visual styling (wrong colour, broken layout) is `fix`, not `style`. `style` is code formatting only.
- Accessibility or SEO gaps that are defects → `fix`; new a11y/SEO capability → `feat`.
- Dependency upgrade to patch a vulnerability → `fix(deps)` if it fixes user-facing risk, otherwise `build(deps)`.
- Research/spike issues → `chore` with scope `spike` unless the outcome is clearly a feature.

## Scope

Optional noun in parentheses: a product (`collecstory`, `personal-website`, `ai-team`) or an area (`auth`, `seo`, `design-tokens`, `deps`). Prefer the area when the repo already implies the product.

## Breaking changes

Append `!` after type/scope when the work breaks a public contract, and add the `breaking-change` label. Mention the migration in the issue body.

## Examples

| Request | Title | Labels |
|---|---|---|
| "The SEO meta tags are missing on collecstory card pages" | `fix(seo): add missing meta tags to card pages` | `type:fix` |
| "We should let collectors share sessions on social" | `feat(sharing): allow sharing collection sessions` | `type:feat` |
| "Upgrade vitest to 4.0.18" | `build(deps): upgrade vitest to 4.0.18` | `type:build` |
| "Remove the old --legacy flag from the CLI" | `feat(cli)!: remove --legacy flag` | `type:feat`, `breaking-change` |
| "Images on the gallery take forever" | `perf(gallery): optimize image delivery` | `type:perf` |
| "Add a release workflow" | `ci: add release workflow` | `type:ci` |
| "Epic: authentication for collecstory" | `feat(auth): user authentication` | `type:feat`, `epic` |
