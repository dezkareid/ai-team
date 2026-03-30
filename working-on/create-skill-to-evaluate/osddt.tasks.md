# Task List: context-tools Plugin & context-evaluator Skill

## Phase 1: Plugin Scaffolding
- [x] [S] Create directory structure `plugins/context-tools/skills/context-evaluator/`
- [x] [S] Create initial `plugins/context-tools/.claude-plugin/plugin.json`
- [x] [S] Create source file `skills/context-evaluator/SKILL.md` with basic metadata

## Phase 2: Skill Definition (`context-evaluator`)
- [x] [M] Author Core Mission and General Rules in `SKILL.md`
- [x] [M] Define Usage Context Rules (Install, Examples, Config)
- [x] [M] Define Development Context Rules (Structure, Scripts, Stack, Dependencies)
- [x] [M] Define Debug and Quality for Development Rules (Common Issues, Testing, Standards)
- [x] [M] Define Technology-Specific Rules (Astro, Next.js, CSS)
- [x] [M] Define Software Type Rules (Web App, Command App, Library)
- [x] [M] Define Agent Tools Context (Agent Tools, MCP Servers)
- [x] [S] Add Update Protocols for `README.md` and context files

## Phase 3: Project Registration
- [x] [S] Update `.agent-structurerc` to register the `context-tools` plugin
- [x] [S] Add the `context-evaluator` skill mapping to `.agent-structurerc`

## Phase 4: Build & Export
- [x] [S] Run `pnpm run build` to ensure scripts are ready
- [x] [S] Run `pnpm run sync-version`
- [x] [S] Run `pnpm run export-claude` and verify `plugins/` content

## Phase 5: Validation
- [x] [S] Test `context-evaluator` skill against `README.md`
- [x] [S] Test `context-evaluator` skill against a source skill file (e.g., `skills/best-practices/SKILL.md`)
- [x] [S] Verify detection of missing mandatory sections

## Dependencies
- Phase 1 must be complete before Phase 2.
- Phase 1 & 2 must be complete before Phase 3.
- Phase 3 must be complete before Phase 4.
- Phase 4 must be complete before Phase 5.

## Definition of Done
- **Phase 1**: Folder structure exists and `plugin.json` is valid.
- **Phase 2**: `SKILL.md` contains all requested evaluation logic and update protocols.
- **Phase 3**: `.agent-structurerc` correctly reflects new plugin and skill.
- **Phase 4**: `plugins/context-tools` is populated with exported/symlinked files.
- **Phase 5**: Skill successfully identifies compliant and non-compliant markdown files.
