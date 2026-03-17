# Plan: Add Web Quality Skills

## Architecture Overview
The integration will follow the project's existing Agent Skills architecture. Each web quality skill will be a first-class citizen in the `skills/` directory, conforming to the `SKILL.md` format and linked to a new `web-quality` Claude plugin defined in `.agent-structurerc`.

Key architectural points:
- **Skill Portability**: Skills are self-contained in `skills/<skill-name>/`.
- **Plugin Registry**: `.agent-structurerc` serves as the source of truth for plugin/skill mapping.
- **Export Pipeline**: The existing `pnpm run export-claude` script will be used to generate the Markdown files in the `plugins/` directory.

## Implementation Phases

### Phase 1: Skill Download & Extraction
Goal: Retrieve the official skills using the `npx skills` utility.
- Run `npx skills add addyosmani/web-quality-skills`.
- Copy the downloaded skills from the `.agents/skills` cache to the project's `skills/` directory.
- Clean up any manual artifacts to ensure 1:1 parity with the source repository.

### Phase 2: Architecture Integration
Goal: Align the downloaded content with the project's plugin structure.
- Ensure all `SKILL.md` files and their `references/` are correctly placed.
- Verify that metadata and frontmatter are intact.

### Phase 3: Plugin Registration
Goal: Update the project configuration to recognize the new skills.
- Add the `web-quality` plugin to `claude-plugins` in `.agent-structurerc`.
- Add entries for each new skill in the `skills` array of `.agent-structurerc`, mapping them to the `web-quality` plugin.

### Phase 4: Verification & Export
Goal: Validate the integration and propagate changes to the plugin directory.
- Run `pnpm run build` to ensure the project is in a clean state.
- Run `pnpm run export-claude` to generate the Markdown versions of the skills in `plugins/web-quality/skills/`.
- Run `pnpm run sync-version` and `pnpm run distribute-mcp` to update metadata if needed (though no MCP changes are expected).
- Manually verify that the exported skills are correctly formatted and linked.

## Technical Dependencies
- `addyosmani/web-quality-skills` (Source content).
- Existing build scripts (`pnpm run export-claude`).

## Risks & Mitigations
- **Broken Links**: Ported reference files might have absolute or broken relative links.
  - *Mitigation*: Perform a link-checking pass during Phase 2.
- **Format Incompatibility**: The source `SKILL.md` files might use a different frontmatter schema.
  - *Mitigation*: Carefully adapt frontmatter based on `skills/design-tokens/SKILL.md`.
- **Context Window Overload**: Large reference files could consume too many tokens.
  - *Mitigation*: Ensure references are properly split and linked rather than inlined.

## Out of Scope
- Porting `.sh` or `.js` scripts from the source repository.
- Creating new tests for the skills themselves (as they are instructional content).
