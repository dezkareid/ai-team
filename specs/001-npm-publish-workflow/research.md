# Research: NPM Publication Workflow (OIDC + pnpm)

## 1. Authentication Method: Trusted Publishers (OIDC)
- **Decision**: Use GitHub Actions OIDC to authenticate with npm.
- **Rationale**: Eliminates the need for long-lived secrets (`NPM_TOKEN`).
- **Key Requirement**: The workflow must have `permissions: id-token: write` **specifically within the release job** to adhere to the principle of least privilege.

## 2. Configuration Strategy: Unified Template
- **Decision**: Use `.github/releaserc-template.json` to store plugins and shared release configuration.
- **Rationale**: Both monorepos and single repos can share the same plugin list.
- **Implementation**: The workflow copies the template to `.releaserc` at runtime. Monorepos include `"extends": "semantic-release-monorepo"` in the template.

## 3. Monorepo Change Detection
- **Decision**: Use `dorny/paths-filter` combined with `.github/packages.yml`.
- **Rationale**: Provides a robust, declarative way to map packages to paths and detect changes for matrix execution.
- **Pattern**:
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

## 4. Package Manager Support
- **Decision**: Support `npm` and `pnpm`. `pnpm` requires `@anolilab/semantic-release-pnpm@5.0.0` in the release plugins.

## 5. Security Standards
- **Provenance**: Enabled through OIDC (`NPM_CONFIG_PROVENANCE: true`).
- **Isolation**: Use `actions/checkout@v5` with `persist-credentials: false` in release jobs.
- **Workflow Triggers**: Support `push` and `pull_request` for `main`, `next`, `beta`, and `alpha` branches.

## 6. Workflow Structure
- **Jobs**: `test` -> `release` (conditional on push).
- **Environment**: `NODE_ENV: production` is mandatory for release jobs.
- **Path Resolution**: Monorepos must dynamically resolve the `PACKAGE_PATH` using `jq` on the `paths-filter` output.
