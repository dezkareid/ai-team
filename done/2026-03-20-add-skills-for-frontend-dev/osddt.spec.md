# Specification: Frontend Development Skills

## Overview
The goal of this feature is to expand the current set of AI utility skills to include specialized support for frontend development. These skills will provide expert procedural guidance for common frontend tasks such as building UI components, styling, state management, and testing. To ensure consistency across the AI Team ecosystem, these skills must be distributed to both Gemini CLI (via the skill activation system) and Claude Code (via exported plugins).

## Requirements
- **Specialized Guidance**: Provide detailed `SKILL.md` files for core frontend domains:
  - **React Development**: Best practices for hooks, component patterns, and TypeScript integration.
  - **Styling**: Modern CSS strategies (Vanilla CSS, CSS Modules) and layout techniques (Flexbox, Grid).
  - **State Management**: Guidance for local state, context, and external libraries.
  - **Frontend Testing**: Patterns for unit, integration, and E2E testing using modern frameworks like Vitest.
- **Cross-Platform Distribution**:
  - Integrate new skills into the `.agent-structurerc` configuration.
  - Ensure the `pnpm run export-claude` command correctly exports these skills as Claude-compatible plugins.
  - Ensure the skills are discoverable and activatable within the Gemini CLI.
- **Documentation**: Each skill must include its own `SKILL.md` with clear instructions, metadata, and references.

## Scope
- **In Scope**:
  - Creation of new `SKILL.md` source files in the `skills/` directory.
  - Updating `.agent-structurerc` to include the new skills and map them to appropriate Claude plugins.
  - Validating that the build and export scripts (`export-claude`, `distribute-mcp`) correctly process the new additions.
- **Out of Scope**:
  - Implementation of new MCP tools specifically for these skills (unless already provided by existing tools like `context7`).
  - Modifications to the core CLI engines of Gemini or Claude.

## Acceptance Criteria
- New frontend-focused skills (React, Styling, State Management, Testing) are present in the `skills/` directory.
- `pnpm run export-claude` successfully creates the corresponding Markdown files and symlinks in the `plugins/` directory.
- The `.agent-structurerc` file is updated with the new skill definitions.
- Running `activate_skill` in a Gemini session with a new frontend skill name correctly loads the expert guidance.
- The `marketplace.json` for Claude plugins reflects the new frontend capabilities.

## Decisions
1. **Plugin Grouping**: Create a new "frontend-tools" Claude plugin to house all the new frontend skills.
2. **Framework Scope**: Provide framework-agnostic guidance as the primary focus.
3. **Specific Libraries**: No new skills will be created from scratch; existing skills from other sources will be copied or adapted.
