# Task List: AGENTS.md Skill Audit

## Checklist

### Phase 1: Skill Implementation
- [x] [S] Create directory `skills/audit-agents-file/`.
- [x] [S] Create `skills/audit-agents-file/SKILL.md` with audit instructions.
- [x] [S] Register the `audit-agents-file` skill in `.agent-structurerc` under the `company-context` plugin.

### Phase 2: Build & Export
- [x] [S] Run `pnpm run build` to ensure latest CLI scripts are compiled.
- [x] [S] Run `pnpm run export-claude` to propagate changes to the `plugins/` directory.

### Phase 3: Verification
- [x] [S] Verify `plugins/company-context/skills/audit-agents-file/SKILL.md` symlink exists and is correct.
- [x] [S] Perform a manual audit of the root `AGENTS.md` file using the new skill to ensure it correctly identifies missing/present sections.

## Dependencies
- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3.

## Definition of Done

### Phase 1: Skill Implementation
- `skills/audit-agents-file/SKILL.md` exists and follows the skill format.
- `.agent-structurerc` includes the new skill.

### Phase 2: Build & Export
- `pnpm run export-claude` completes without errors.
- New skill is visible in the `plugins/` structure.

### Phase 3: Verification
- The skill is manually verified to work as expected on the project's `AGENTS.md`.
