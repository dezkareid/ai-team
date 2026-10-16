---
name: github-issues
description: "Administers company work on the GitHub Project \"Dezkareid Enterprise\": create, update, assign, prioritize, move status, close or delete issues and epics, attach sub-issues to epics, and categorize every issue with Conventional Commits types. Use this skill whenever the user wants to plan work, open a ticket/bug/task/story, track an epic, triage or groom the backlog, move an issue across the board, assign someone, or asks what is in progress — even if they don't say \"GitHub Project\" explicitly."
metadata:
  version: "0.1.0"
---

## Overview

Company work is planned in a single GitHub Project (v2) owned by the user `dezkareid`, titled **Dezkareid Enterprise**. Issues live in their product repositories (e.g. `dezkareid/ai-team`) and are added to the project so all products share one board.

Every issue is categorized with a **Conventional Commits type**. The type appears in three places that must stay in sync: the issue title prefix, a `type:<type>` label, and the project `Type` field. Keeping them aligned means the board can be filtered by type, and the eventual commits/PRs that close the issue naturally reuse the same type.

All operations use the `gh` CLI. Exact commands and GraphQL snippets live in `references/gh-project-commands.md`; type rules and examples live in `references/conventional-commits.md`. Read them when you need specifics.

## Project model

| Field | Kind | Values |
|---|---|---|
| `Status` | single select | Backlog, Todo, In Progress, In Review, Done |
| `Type` | single select | feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert |
| `Priority` | single select | P0 (urgent), P1 (high), P2 (normal), P3 (low) |
| `Product` | single select | personal-website, collecstory, ai-team, default |
| `Size` | single select | XS, S, M, L, XL |
| `Target date` | date | YYYY-MM-DD |

Labels (per repo): `type:<type>` for each Conventional Commits type, `epic`, `breaking-change`.

**Epics** are regular issues with the `epic` label. Their child issues are attached as GitHub **sub-issues**, so the epic shows native progress. User-owned accounts don't have Issue Types, which is why a label is used instead.

## Before acting

1. Verify auth: `gh auth status` must list the `project` scope. If it doesn't, stop and ask the user to run `gh auth refresh -s project` — every project command fails without it.
2. Resolve the project number: `gh project list --owner dezkareid --format json --jq '.projects[] | select(.title=="Dezkareid Enterprise") | .number'`.
3. Resolve the target repo. Default to the current git repo (`gh repo view --json nameWithOwner`). If the request names a product, map it to its repo and the `Product` field. Ask if it's ambiguous.
4. Field and option IDs are needed to set single-select values. Fetch them once per session with `gh project field-list` (see reference) and reuse them.

## Categorizing with Conventional Commits

Title format: `<type>(<scope>)<!>: <short imperative description>`

- `type` — one of the 11 types; pick from what the work *produces*, not how it was reported. A user report "the login page crashes" is `fix`; "add dark mode" is `feat`; "upgrade rollup" is `build` (or `chore` if it doesn't touch the build); "speed up image loading" is `perf`.
- `scope` — optional, a product or area (`collecstory`, `auth`, `seo`). Lowercase, short.
- `!` — the change breaks an existing contract (API, CLI flags, config format). Also add the `breaking-change` label.
- description — lowercase, imperative, no trailing period, ≤ 72 chars total title.

When the type is genuinely unclear (e.g. "look into the dashboard"), propose your best guess with a one-line reason and let the user confirm rather than silently choosing. Full table and examples: `references/conventional-commits.md`.

## Operations

Each operation below is a short sequence; commands are in `references/gh-project-commands.md`.

### Create an issue
1. Derive type, scope, title, and body (use the issue template in the reference: context, acceptance criteria).
2. `gh issue create` with labels `type:<type>` (+ `breaking-change` if `!`).
3. `gh project item-add` to the project; capture the item ID.
4. Set fields: `Status` = Backlog (or Todo if the user says it's ready), `Type`, and `Priority`/`Product`/`Size`/`Target date` when known. Default Priority is P2 if unstated.
5. If the user mentions an epic, attach it as a sub-issue (see Epics).
6. Report back the issue URL and the fields that were set.

### Update an issue
- Title/body/labels: `gh issue edit`.
- Re-categorizing changes three things together: title prefix, swap the `type:*` label, and the `Type` field. Never update one without the others.
- Field changes (priority, size, product, date): `gh project item-edit` with the item ID.

### Assign / unassign
`gh issue edit <n> --add-assignee <login>` / `--remove-assignee`. `@me` means the authenticated user. Assigning doesn't change Status unless the user asks; suggest moving to In Progress if they say they're starting.

### Move status
`gh project item-edit` with the `Status` option ID. Conventions:
- **In Review** when a PR is open for it.
- **Done** when the issue is closed. Closing an issue → also set Status Done; reopening → set Todo.

### Close vs delete
- **Close** is the normal end of life: `gh issue close <n> --reason completed|"not planned"`, then Status = Done.
- **Remove from board** only: `gh project item-delete` (issue still exists).
- **Delete** is permanent and loses history. Only do it when the user explicitly says delete, and confirm the issue number and title before running `gh issue delete`.

### Epics
- **Create**: same as an issue, plus the `epic` label. Type is usually `feat` (or `refactor`/`chore` for technical epics). Use the epic body template (goal, scope, out of scope, success criteria).
- **Attach / detach children**: sub-issues via GraphQL `addSubIssue` / `removeSubIssue` using issue node IDs (newer `gh` also supports `gh issue edit <epic> --add-sub-issue <n>`; check `gh issue edit --help`). An issue can only have one parent; if it already has one, ask before moving it.
- **Create a child directly**: create the issue, then attach it.
- **Progress**: query `subIssuesSummary` (total, completed, percentCompleted) and list children with their Status.
- Closing an epic while children are open: warn and list the open children first.

### List / query
`gh project item-list --format json` then filter with `--jq` by status, type, assignee, product, or label. For "what's in progress?" group by Status; for a product, filter by `Product`. Keep output a compact table: number, title, status, assignee, priority.

## Safety

- Confirm before deletes and before bulk changes (more than ~5 issues at once); show the list that will change.
- Don't touch repos or projects other than the ones the user referenced.
- If a command fails because a field, option, or label doesn't exist, report it and offer to create it — don't silently skip categorization.
- After each change, report what was done with links so the user can verify.
