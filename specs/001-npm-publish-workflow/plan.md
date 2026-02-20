# Implementation Plan: NPM Publication Workflow Command

**Branch**: `001-npm-publish-workflow` | **Date**: 2026-02-19 | **Spec**: [spec.md](./spec.md)

## Summary
Create a secure, OIDC-powered GitHub Actions workflow for publishing packages to npm. This command automates the setup of local actions and shared templates, supporting both single repositories and monorepos with job-level security and best practices.

## Technical Context

**Language/Version**: Node.js 22+, YAML (GitHub Actions)
**Primary Dependencies**: `cycjimmy/semantic-release-action@v6`, `actions/checkout@v5`, `dorny/paths-filter@v3`
**Constraints**: 
- Use Trusted Publishers (OIDC) exclusively.
- Permissions MUST be job-level (`release` job).
- Unified configuration via `releaserc-template.json`.
- `NODE_ENV: production` for release.

## Constitution Check

- [x] Trusted Publisher requirement met (Security Gate).
- [x] Monorepo support requirement met (Feature Scope Gate).
- [x] Least privilege permissions (Job-level) met.

## Project Structure

### Documentation

```text
specs/001-npm-publish-workflow/
├── plan.md              # This file
├── research.md          # Architectural decisions
├── data-model.md        # Entities and validation
├── quickstart.md        # User guide
├── contracts/           # Workflow schema
└── tasks.md             # Implementation tasks
```

### Source Code

```text
.github/
├── actions/             # Local actions (setup-js, semantic-release)
├── workflows/           # ci.yml or ci-packages.yml
├── packages.yml         # Monorepo mapping
└── releaserc-template.json # Shared release config

commands/
└── npm/
    └── publish-setup.toml # Command definition
```
