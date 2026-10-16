---
name: orca-setup
description: "Configures a repository for Orca so every new worktree is ready to work: copies the gitignored env files from the main checkout and runs pnpm install. Use when the user asks to set up Orca, add or fix orca.yaml, configure worktree setup/archive hooks, or when a new Orca worktree is missing .env files or node_modules."
metadata:
  version: "0.0.1"
---

## Overview

Orca runs each task in its own git worktree. A fresh worktree only contains tracked files, so gitignored env files (`.env`, `apps/*/.env.local`, ...) and `node_modules` are missing. This skill adds an `orca.yaml` to the repository root whose hooks fix that:

- **`scripts.setup`** runs inside the new worktree after Orca creates it. It copies every gitignored `.env*` file from the main checkout into the worktree, keeping the same relative path, then runs `pnpm install --frozen-lockfile`.
- **`scripts.archive`** runs before the worktree is archived or removed, and deletes `node_modules` to free disk space.

All our repositories share the same stack (pnpm workspaces + turbo), so the same template in [references/orca.yaml](./references/orca.yaml) is reused everywhere.

### Orca facts this skill relies on

- Setup and archive scripts receive `ORCA_ROOT_PATH` (main checkout), `ORCA_WORKTREE_PATH` (new worktree) and `ORCA_WORKSPACE_NAME`.
- `.worktreeinclude` only accepts **literal, root-relative paths**. Orca skips glob (`*`, `?`) and negation (`!`) lines with a warning, so an entry such as `**/*.env.local` copies nothing. That is why env files are copied by the setup script instead.

## Procedure

### 1. Detect the stack

Confirm the repository uses pnpm: `pnpm-lock.yaml` exists at the root or `package.json` has `"packageManager": "pnpm@..."`. If it does not, stop and tell the user that the template assumes pnpm and needs adapting (for example `npm ci` or `yarn install --immutable`).

### 2. Inspect the existing state

- **`orca.yaml`**: if it exists, read it and merge into it. Keep any other keys (`worktree.sharedDirectories`, `environmentRecipes`, ...) and any extra setup steps the user already has, and fold the env copy plus `pnpm install` into the existing `scripts.setup`. Never overwrite the file blindly.
- **`.worktreeinclude`**: if it exists, look for glob or negation lines. Remove them (or delete the file if nothing literal is left), and explain that Orca ignores them and that the setup script now covers env files. Keep literal entries for things that are not env files.

### 3. Preview the env files that will be copied

From the repository root, list what the setup script will copy:

```bash
find . \( -name node_modules -o -name .git -o -name .turbo -o -name .next -o -name dist \) -prune -o \
  -type f -name '.env*' ! -name '*.example' ! -name '*.sample' ! -name '*.template' -print |
while IFS= read -r f; do git check-ignore -q "$f" && echo "$f"; done
```

Show the list to the user and ask them to confirm it. Do **not** print or read the contents of these files, because they contain secrets. If the list is empty, say so: the setup still runs `pnpm install`, and env files will be picked up automatically once they exist in the main checkout.

### 4. Write `orca.yaml`

Copy [references/orca.yaml](./references/orca.yaml) to the repository root (or merge it, per step 2). Adjust it only when the repository needs it:

- Add extra build-output directories to the `-prune` list if the repo has other large ignored folders.
- Append extra setup steps after `pnpm install` (for example a codegen step) only if the user asks for them.

### 5. Verify

Dry-run the setup block against a throwaway worktree:

```bash
git worktree add /tmp/orca-setup-check -b orca-setup-check
export ORCA_ROOT_PATH="$PWD" ORCA_WORKTREE_PATH=/tmp/orca-setup-check
# run the body of scripts.setup from orca.yaml here
git worktree remove --force /tmp/orca-setup-check && git branch -D orca-setup-check
```

Check that the env files from step 3 now exist in the worktree, and that `pnpm install` finished. Alternatively, if Orca is running, create a real worktree with `orca worktree create --name orca-setup-check --json` and watch its Setup terminal (see the `orca-cli` skill), then remove it with `orca worktree rm`.

### 6. Commit

Commit `orca.yaml` (and any `.worktreeinclude` change) using Conventional Commits, for example `chore: add orca.yaml worktree setup`. Never commit directly to `main` or `master`. Propose a branch first.
