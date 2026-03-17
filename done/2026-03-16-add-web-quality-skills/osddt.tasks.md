# Tasks: Add Web Quality Skills

## Phase 1: Skill Download & Extraction
- [x] [M] Run `npx skills add addyosmani/web-quality-skills` to fetch official skills
- [x] [S] Extract skills from `.agents/skills` to project `skills/` directory
- [x] [S] Clean up manual artifacts and verify 1:1 parity with source

## Phase 2: Plugin Registration
- [x] [S] Register the `web-quality` plugin in `.agent-structurerc`
- [x] [S] Add all 6 new skills to the `skills` array in `.agent-structurerc`

## Phase 3: Verification & Export
- [x] [S] Run `pnpm run build` to verify project integrity
- [x] [S] Run `pnpm run export-claude` to generate the plugin markdown files
- [x] [S] Run `pnpm run sync-version` and `pnpm run distribute-mcp` to sync metadata
- [x] [S] Verify final exported skills in `plugins/web-quality/`

## Definition of Done
### Phase 1
- All directories and `references/` subdirectories exist under `skills/` with accurate content.

### Phase 2
- `.agent-structurerc` correctly maps all new skills to the `web-quality` plugin.

### Phase 3
- The `plugins/web-quality/` directory contains all 6 skills in Markdown format.
- Build and export commands complete without errors.

## Dependencies
- Phase 2 depends on Phase 1 completion.
- Phase 3 depends on Phase 2 completion.
