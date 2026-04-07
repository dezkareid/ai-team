# Implementation Plan: Skills for React, Styles, and FSD Architecture

## Architecture Overview
The implementation follows the established project structure for AI skills. Each skill will be a self-contained directory under `skills/` containing:
- `SKILL.md`: The core instructions, metadata, and tool mappings.
- `references/`: Detailed guides and code samples.
- Integration into `.agent-structurerc` to enable distribution to Gemini and Claude plugins.

**Claude Integration**: All new skills will be assigned to the `frontend-tools` plugin in `.agent-structurerc` to ensure they are available within the same specialized toolset.

The technical focus for each skill:
- **React Components**: Emphasis on TypeScript-first development, specifically using `React.HTMLAttributes` (or specialized variants like `React.ButtonHTMLAttributes`) to ensure components are standard-compliant and extensible.
- **Styles Methodology**: A combination of BEM (naming) and OOCSS (organization), designed for Vanilla CSS but structured for future SASS scalability.
- **FSD Architecture**: Implementation of the Feature-Sliced Design methodology, with specific considerations for Next.js (App Router vs Pages Router) to prevent conflicts between FSD folders and Next.js reserved file conventions.

## Implementation Phases

### Phase 1: React Component Building Skill
- **Goal**: Create comprehensive guidance for building extensible React components.
- **Steps**:
  - Scaffolding `skills/react-components/SKILL.md`.
  - Writing reference guides for component composition.
  - Creating samples showing `HTMLAttributes` integration in TypeScript.

### Phase 2: Styles Methodology Skill
- **Goal**: Establish a standardized styling methodology (BEM + OOCSS).
- **Steps**:
  - Scaffolding `skills/styles-methodology/SKILL.md`.
  - Creating reference guides for OOCSS-based layout and skin separation.
  - Adding BEM naming convention samples.
  - Documenting Vanilla CSS organization for future SASS migration.

### Phase 3: FSD Architecture Skill
- **Goal**: Provide a definitive guide for Feature-Sliced Design in modern frontend projects.
- **Steps**:
  - Scaffolding `skills/fsd-architecture/SKILL.md`.
  - Mapping the 6 layers (App, Pages, Widgets, Features, Entities, Shared).
  - Adding specific Next.js "app/" directory vs FSD "pages/" layer conflict mitigation.
  - Creating cross-layer communication samples.

### Phase 4: Integration & Validation
- **Goal**: Register and export skills for all agents.
- **Steps**:
  - Update `.agent-structurerc` with the new skills, mapping them to the `frontend-tools` Claude plugin.
  - Run `pnpm run build` and `pnpm run export-claude` to generate plugin files.
  - Verify skill loading in Gemini and Claude environments.

## Technical Dependencies
- **TypeScript**: For accurate types in React samples.
- **Next.js**: As the primary framework for FSD-specific considerations.
- **Changesets**: For managing versions of the new skills.
- **Existing Build Scripts**: `pnpm run build`, `pnpm run export-claude`, `pnpm run distribute-mcp`.

## Risks & Mitigations
- **FSD/Next.js Folder Conflicts**: Next.js reserved folders (like `app/`, `api/`) can conflict with FSD layers.
  - *Mitigation*: Explicitly document how to organize FSD layers when using the Next.js `src/` directory and `app/` router.
- **Skill Bloat**: Skills can become too verbose for efficient context usage.
  - *Mitigation*: Keep `SKILL.md` concise and move extensive code samples and edge cases to `references/`.

## Out of Scope
- Creating actual component libraries or boilerplates.
- Modifying existing project codebases.
- Support for SASS implementation (only architectural preparation).
