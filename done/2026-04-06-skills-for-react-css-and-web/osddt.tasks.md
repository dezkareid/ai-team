# Task List: Skills for React, Styles, and FSD Architecture

## Checklist

### Phase 1: React Component Building Skill
- [x] [S] Create directory `skills/react-components/` and `skills/react-components/references/`
- [x] [S] Scaffolding `skills/react-components/SKILL.md` with metadata and core intent
- [x] [M] Write `skills/react-components/references/html-attributes.md` with TS extensibility samples
- [x] [M] Write `skills/react-components/references/composition-patterns.md` covering standard building blocks
- [x] [S] Add `skills/react-components/SKILL.md` to `.agent-structurerc` under `frontend-tools` plugin

### Phase 2: Styles Methodology Skill
- [x] [S] Create directory `skills/styles-methodology/` and `skills/styles-methodology/references/`
- [x] [S] Scaffolding `skills/styles-methodology/SKILL.md` with BEM + OOCSS focus
- [x] [M] Write `skills/styles-methodology/references/naming-bem.md` with code samples
- [x] [M] Write `skills/styles-methodology/references/organization-oocss.md` explaining layout/skin separation
- [x] [S] Document Vanilla CSS to SASS migration path in `skills/styles-methodology/references/future-sass.md`
- [x] [S] Add `skills/styles-methodology/SKILL.md` to `.agent-structurerc` under `frontend-tools` plugin

### Phase 3: FSD Architecture Skill
- [x] [S] Create directory `skills/fsd-architecture/` and `skills/fsd-architecture/references/`
- [x] [S] Scaffolding `skills/fsd-architecture/SKILL.md` defining the 6 layers
- [x] [M] Write `skills/fsd-architecture/references/layers-definition.md` mapping App, Pages, Widgets, Features, Entities, Shared
- [x] [M] Write `skills/fsd-architecture/references/nextjs-integration.md` addressing folder conflicts and app/ directory setup
- [x] [M] Write `skills/fsd-architecture/references/cross-layer-communication.md` with rules and samples
- [x] [S] Add `skills/fsd-architecture/SKILL.md` to `.agent-structurerc` under `frontend-tools` plugin

### Phase 4: Integration & Validation
- [x] [S] Run `pnpm run build` to compile scripts
- [x] [S] Run `pnpm run export-claude` to generate plugin files
- [x] [S] Run `pnpm run distribute-mcp` to sync MCP configurations
- [x] [M] Verify skill content in `plugins/frontend-tools/skills/`
- [x] [S] Create changesets for each new skill using `pnpm changeset`

## Dependencies
- Phase 1, 2, and 3 can be performed in parallel.
- Phase 4 depends on the completion of Phases 1, 2, and 3.
- Registering skills in `.agent-structurerc` is required before Phase 4.

## Definition of Done

### Phase 1 Done
- `skills/react-components/` is fully populated and registered.

### Phase 2 Done
- `skills/styles-methodology/` is fully populated and registered.

### Phase 3 Done
- `skills/fsd-architecture/` is fully populated and registered.

### Phase 4 Done
- All skills are successfully exported and visible in the `plugins/` directory.
- `pnpm run build` passes with no errors.
