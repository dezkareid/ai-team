# Tasks: NPM Publication Workflow Command

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and command definition.

- [x] T001 Create command definition file in `commands/npm/publish-setup.toml`.
- [x] T002 Implement `setup-js` and `semantic-release` local actions.
- [x] T003 Create `.github/releaserc-template.json` template.

---

## Phase 2: Foundational Logic

**Purpose**: Core detection and generation utilities.

- [x] T004 Implement project type detection (Single vs Monorepo).
- [x] T005 Implement package manager detection (`npm` vs `pnpm`).
- [x] T006 Implement dynamic `tag-format` resolution logic.
- [x] T007 Implement template-to-file copy logic for `.releaserc`.

---

## Phase 3: Workflow Implementation (🎯 MVP)

**Goal**: Automate the generation of the CI workflows.

- [x] T008 Generate `ci.yml` for single repositories with test dependency.
- [x] T009 Generate `ci-packages.yml` for monorepos with `check-changes` job.
- [x] T010 Generate `.github/packages.yml` mapping template for monorepos.
- [x] T011 Implement job-level OIDC permissions and `persist-credentials: false`.
- [x] T012 Implement `NODE_ENV: production` for release environments.

---

## Phase 4: Validation & Instructions

**Purpose**: User guidance and edge case handling.

- [x] T013 Generate setup instructions with link to npmjs.com.
- [x] T014 Implement warning for `private: true` packages.
- [x] T015 Verify `actions/checkout@v5` and `dorny/paths-filter@v3` versions.
