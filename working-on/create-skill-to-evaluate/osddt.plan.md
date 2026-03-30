# Implementation Plan: context-tools Plugin & context-evaluator Skill

## Architecture Overview
The solution follows the established plugin-based architecture of the `ai-team` project.
- **Plugin**: `context-tools` will be a new directory under `plugins/`.
- **Skill**: `context-evaluator` will be a skill within this plugin, implemented primarily as a `SKILL.md` file providing expert procedural guidance to AI agents.
- **Design Principle**: The skill relies on natural language instructions for agents to evaluate markdown structure, rather than a separate code-based parsing library.

## Implementation Phases

### Phase 1: Plugin Scaffolding
- Create the plugin directory structure: `plugins/context-tools/skills/context-evaluator/`.
- Initialize `plugins/context-tools/.claude-plugin/plugin.json` with metadata.
- Create the source skill file at `skills/context-evaluator/SKILL.md`.

### Phase 2: Skill Definition (`context-evaluator`)
Develop the content of `SKILL.md` to include:
- **Core Mission**: Evaluate if project context is sufficient for both usage and development.
- **Usage Context Rules**: Ensure sections like `# Install`, `## Usage Examples`, and `## Configuration` exist and are clear.
- **Development Context Rules**: Ensure sections for `# Project Structure`, `## Scripts` (dev, test, build), `## Tech Stack`, and `## Dependencies` are present.
- **Debug Context Rules**: Ensure sections for `# Debugging`, `## Common Issues`, `## Logging`, and `## Error Handling` are present to aid developers in troubleshooting.
- **Quality for Development Rules**: Ensure sections for `# Quality Assurance`, `## Testing Strategy`, `## Linting & Formatting`, and `## Performance Standards` are present to maintain high code quality.
- **Technology-Specific Considerations**: Include rules to evaluate context for specific software stacks (e.g., Astro, Next.js) and technologies (e.g., CSS), ensuring they follow best practices for those specific tools.
- **Software Type Considerations**: Include specialized evaluation criteria for different software types (e.g., Web Applications, Command Applications, Libraries/Packages).
- **Agent Tools Context**: Ensure a section for `# Agent Tools` or `# MCP Servers` exists, documenting available tools, their purposes, and how to use them.
- **General Rules**: Validate `# Goal of the Project`, `# Documentation` links, and frontmatter integrity (e.g., `metadata.version`).
- **Update Protocols**: Instructions for agents to update `README.md` and related context files whenever new functionality is added or existing logic changes.

### Phase 3: Project Registration
- Update `.agent-structurerc` to include the `context-tools` plugin and the `context-evaluator` skill.
- Register the mapping between the source skill and the plugin.

### Phase 4: Build & Export
- Run `pnpm run build` to compile scripts.
- Run `pnpm run sync-version` to propagate versioning.
- Run `pnpm run export-claude` to generate the plugin metadata and symlinks.

### Phase 5: Validation
- Manually test the skill by invoking it on existing markdown files (e.g., `AGENTS.md`, `README.md`).
- Verify that the agent correctly identifies missing sections or stale documentation.

## Technical Dependencies
- **Node.js/pnpm**: For project management and build scripts.
- **Gemini CLI/Claude Code**: For executing and testing the skill.

## Risks & Mitigations
- **Risk**: Subjectivity in agent evaluation (what is "enough" context?).
- **Mitigation**: Define explicit mandatory section names and provide examples of "good" vs "bad" content within the skill instructions.
- **Risk**: Version mismatch between source and plugin exports.
- **Mitigation**: Rely on the existing `sync-version` and `export-claude` scripts.

## Out of Scope
- Automated refactoring or fixing of markdown files.
- Evaluation of non-markdown files.
- Context evaluation for the `context/` folder (as per Decision 2 in Spec).
