# Feature Specification: NPM Publication Workflow Command

**Feature Branch**: `001-npm-publish-workflow`  
**Created**: 2026-02-19  
**Status**: Draft  
**Input**: User description: "Create a gemini command to setup the npm publication workflow using github CI/CD"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial CI/CD Publication Setup (Priority: P1)

As a developer, I want to quickly set up a GitHub Actions workflow for automated publishing using Trusted Publishers (OIDC) so that I don't have to manage long-lived npm tokens.

**Why this priority**: Core value—automating CI/CD with modern security practices (OIDC) without manual secret management.

**Independent Test**: Can be fully tested by running the command in a repository with a `package.json` and verifying that `.github/workflows/ci.yml` (or `ci-packages.yml`) is created with job-level `id-token: write` permissions.

**Acceptance Scenarios**:

1. **Given** a single-package repository, **When** I run the setup command, **Then** a `ci.yml` workflow and a `releaserc-template.json` are created.
2. **Given** a monorepo, **When** I run the setup command, **Then** a `ci-packages.yml` workflow, a `releaserc-template.json`, and a `packages.yml` mapping file are created.
3. **Given** any setup, **When** the workflow runs, **Then** the `release` job MUST depend on a successful `test` job.

---

### User Story 2 - Monorepo Change Detection (Priority: P2)

As a monorepo maintainer, I want the publication workflow to only attempt releases for packages that have actually changed, minimizing CI usage and avoiding redundant release attempts.

**Why this priority**: Essential for efficiency in monorepos.

**Acceptance Scenarios**:

1. **Given** a monorepo setup, **When** a push occurs, **Then** the `check-changes` job uses `dorny/paths-filter` and `.github/packages.yml` to identify changed packages.
2. **Given** identified changes, **When** the release job runs, **Then** it uses a matrix to process only those specific packages.

---

### Edge Cases

- **Package Not Yet Published**: Trusted Publishing requires the package to already exist on npm. If it doesn't, the command should refer the user to `@commands/npm-package/setup.toml` for the initial publish.
- **Missing `package.json`**: The command should warn or error if it can't find a `package.json` file.
- **Private Packages**: Trusted publishing configuration differs for private vs public packages; the command should warn if `private: true` is set.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a GitHub Actions workflow file (`ci.yml` or `ci-packages.yml`).
- **FR-002**: System MUST generate `.github/releaserc-template.json` for both repo types.
- **FR-003**: System MUST configure the `release` job with `permissions: id-token: write` for OIDC support.
- **FR-004**: System MUST ensure the `release` job depends on the `test` job (`needs: test`).
- **FR-005**: System MUST use `actions/checkout@v5` with `persist-credentials: false`.
- **FR-006**: System MUST set `NODE_ENV: production` in the release environment.
- **FR-007**: System MUST provide the user with the npmjs.com configuration link for Trusted Publishers.

### Key Entities

- **Release Template**: `.github/releaserc-template.json` containing plugins and optional monorepo extension.
- **Package Mapping**: `.github/packages.yml` for monorepo path resolution.
- **Local Actions**: `.github/actions/setup-js` and `.github/actions/semantic-release`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate an OIDC-compatible publication workflow in under 30 seconds.
- **SC-002**: 100% of generated workflows place OIDC permissions at the job level.
- **SC-003**: 100% of generated workflows include both `push` and `pull_request` triggers for the configured branches.
- **SC-004**: Users are provided with the direct link to configure Trusted Publishers on npm for their specific package.
