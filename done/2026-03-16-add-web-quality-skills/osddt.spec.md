# Specification: Add Web Quality Skills

## Overview
This feature aims to integrate a suite of "Web Quality Skills" into the project's architecture. These skills are sourced from the [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) repository and integrated using the `npx skills add` utility.

## Requirements
- **Skill Integration**: Use `npx skills add addyosmani/web-quality-skills` to download and install the official versions of the following skills:
  - `performance`
  - `accessibility`
  - `seo`
  - `core-web-vitals`
  - `best-practices`
  - `web-quality-audit`
- **Architecture Alignment**: The new skills must follow the project's existing structure:
  - Located in the `skills/` directory.
  - Each skill must have a `SKILL.md` file with appropriate frontmatter.
  - Supporting documentation should be placed in a `references/` subdirectory within each skill.
- **Plugin Configuration**: Register the new skills in `.agent-structurerc` under a new or existing Claude plugin (e.g., `web-quality`).
- **Standardized Format**: Ensure all `SKILL.md` files adhere to the project's standards for naming, description, and content structure, as seen in `skills/design-tokens/SKILL.md`.

## Scope
### In Scope
- Creating the directory structure for each web quality skill.
- Porting the instructional content (`SKILL.md`) and reference materials (`references/*.md`) from the source repository.
- Updating `.agent-structurerc` to include the new skills and a corresponding Claude plugin definition.
- Ensuring the skills are correctly linked and accessible to AI agents using this repository.

### Out of Scope
- Porting automation scripts (`scripts/`) from the source repository (unless strictly required for the skills to function).
- Implementing the actual optimization logic within the project (the skills provide *instructions* to the agent, not automated fixes).
- Modifying existing skills (e.g., `design-tokens`).

## Acceptance Criteria
- A new directory for each skill (e.g., `skills/performance/`) exists and contains a valid `SKILL.md`.
- All reference files mentioned in `SKILL.md` are present in the respective `references/` directories.
- `.agent-structurerc` is updated with a `web-quality` plugin and all new skills are correctly mapped to it.
- The `SKILL.md` files pass any existing linting or validation checks (if applicable).
- Running the project's export/sync commands (e.g., `pnpm run export-claude`) successfully propagates the new skills to the `plugins/` directory.

## Research Summary
- Source Repository: `addyosmani/web-quality-skills`.
- Core Skills: Performance, Accessibility, SEO, Core Web Vitals, Best Practices, Web Quality Audit.
- Format: `SKILL.md` for instructions, `references/` for deep-dives.

## Decisions
1. **Plugin Grouping**: Group all skills under a single 'web-quality' plugin.
2. **Project-Level Conventions**: Stick to the default instructions from the source repository.
