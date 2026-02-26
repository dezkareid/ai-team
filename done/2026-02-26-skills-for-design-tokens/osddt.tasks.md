# Task List: Design System Tokens Skill

## Phase 1: Infrastructure & Configuration (Refactoring)
- [x] [S] Rename `skills/` to follow Agent Skills structure: `skills/design-tokens/SKILL.md`.
- [x] [S] Update `.agent-structurerc`: rename plugin to `design-system` and skill to `design-tokens`.
- [x] [S] Ensure `SKILL.md` frontmatter matches the directory name (`name: design-tokens`).

## Phase 2: Skill Definition & Reference Structure
- [x] [M] Re-author `skills/design-tokens/SKILL.md` following Agent Skills specification.
- [x] [S] Create `skills/design-tokens/references/` directory.
- [x] [S] Update AI instructions in `SKILL.md` to point to the `references/` folder for tokens.

## Phase 3: Export & Integration Updates
- [x] [M] Update `src/cli/export-claude.ts` to handle directory-based skills (Agent Skills spec).
- [x] [M] Update export logic to copy tokens into the skill's `references/` directory within the plugin.
- [x] [S] Verify that the exported plugin has the correct `design-system` name and `design-tokens` tool/skill.

## Dependencies
- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3.

## Definition of Done
- **Structure**: Skill follows `skills/<name>/SKILL.md` format.
- **Naming**: Plugin is `design-system`, Skill/Tool is `design-tokens`.
- **Export**: `npm run export-claude` generates a valid Agent Skill structure with tokens in `references/`.
