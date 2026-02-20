# Quickstart: NPM Publication Workflow Setup

## Overview
This command automates the setup of a secure, OIDC-powered GitHub Actions workflow for publishing packages to npm.

## Usage
Run the command in your project root:
`/npm.publish-setup`

**Note**: The workflow is automatically configured to trigger on **push** and **pull_request** events for `main`, `next`, `beta`, and `alpha` branches.

## What it Does
1. Detects project structure (monorepo/single) and package manager.
2. Generates shared infrastructure:
   - `.github/actions/setup-js/action.yml`
   - `.github/actions/semantic-release/action.yml`
   - `.github/releaserc-template.json`
3. Generates the main workflow:
   - **Single Repo**: `.github/workflows/ci.yml`
   - **Monorepo**: `.github/workflows/ci-packages.yml` and `.github/packages.yml` template.
4. Ensures security and best practices:
   - Job-level OIDC permissions (`id-token: write`).
   - `test` job dependency before `release`.
   - `NODE_ENV: production` for release environments.
5. Provides instructions for configuring the **Trusted Publisher** on [npmjs.com](https://www.npmjs.com/).

## Prerequisites
- Your package MUST already be published to npm (at least version 0.0.1).
- If it's a new package, use `/npm-package.setup` for the initial publish.
- You MUST have admin access to the repository on GitHub.

## Post-Setup Steps
1. Navigate to your package on [npmjs.com](https://www.npmjs.com/).
2. Go to **Settings** > **Publishing** > **Trusted Publishers**.
3. Add a new publisher with:
   - **Repository Owner**: `[your-org/user]`
   - **Repository Name**: `[your-repo]`
   - **Workflow Name**: `ci.yml` or `ci-packages.yml`
   - **Environment**: (Optional, e.g., `production`)
