# Expected Workflow Schema: NPM Publication (OIDC + Semantic Release)

## 1. Required Permissions
Permissions MUST be defined at the job level (specifically the `release` job) to adhere to the principle of least privilege:
```yaml
permissions:
  contents: write # Required for releases and changelog commits
  id-token: write # Required for OIDC and provenance
  pull-requests: write # Required for release comments
  issues: write # Required for release update comments
```

## 2. Trigger Configuration
- **Branch Triggers (push and pull_request)**:
  ```yaml
  on:
    pull_request:
      branches: [main, next, beta, alpha]
    push:
      branches: [main, next, beta, alpha]
  ```

## 3. Monorepo Logic
Monorepos use a three-job architecture:
1. **`test`**: Runs tests for changed packages.
2. **`check-changes`**: Detects changes using `dorny/paths-filter@v3` and `.github/packages.yml`.
3. **`release`**: Performs the release for changed packages using a matrix and path resolution.

### Change Detection Example:
```yaml
check-changes:
  outputs:
    packages: ${{ steps.filter.outputs.changes }}
  steps:
    - uses: dorny/paths-filter@v3
      id: filter
      with:
        list-files: json
        filters: .github/packages.yml
```

## 4. Single Repo Logic
Single repos use a two-job architecture:
1. **`test`**: Runs global tests.
2. **`release`**: Performs the release (conditional on `push` event).

## 5. Security Standards
- **Isolation**: `actions/checkout@v5` with `persist-credentials: false`.
- **Environment**: `NODE_ENV: production` is set for all release jobs.
- **Provenance**: `NPM_CONFIG_PROVENANCE: true` is set in release environments.
