# Implementation Plan: AGENTS.md Skill Audit

## Proposed Changes

### 1. New Skill Source
Create a new skill file `skills/audit-agents-file/SKILL.md`. This file will contain the instructions for an AI agent to perform a structural audit of an `AGENTS.md` file.

**Rules for Audit:**
- Must have a project description (introductory text before the first heading or immediately after the main title).
- Must have the following mandatory Level 2 (##) sections:
  - `Overview`
  - `Development`
  - `Testing`
  - `Documentation`
- Report missing sections as errors.
- Report formatting inconsistencies as warnings.

### 2. Register Skill in Configuration
Update `.agent-structurerc` to include the `audit-agents-file` skill.
- Assign it to the `company-context` plugin.
- Path: `skills/audit-agents-file/SKILL.md`.

### 3. Build and Export
- Run `pnpm run build` to compile scripts.
- Run `pnpm run export-claude` to update the `plugins/` directory, symlinking the new skill.

## Technical Decisions
- **Skill Format**: Standard Markdown with YAML frontmatter, following the pattern of `design-tokens` skill.
- **Integration**: Registered via `.agent-structurerc` to ensure compatibility with both Gemini CLI and exported Claude plugins.
- **Verification**: Manual verification of the exported symlink and a trial run of the audit on the existing `AGENTS.md`.

## Verification Plan

### Automated Tests
- No new automated tests are required for the skill content itself, as it's a prompt-based tool.
- Verification of `.agent-structurerc` structure is implicitly handled by `pnpm run export-claude` which fails on missing files.

### Manual Verification
1. Verify the creation of `plugins/company-context/skills/audit-agents-file/SKILL.md`.
2. Confirm the symlink points to the correct source file.
3. Test the skill by asking the agent: "Audit the project's AGENTS.md file using the audit-agents-file skill."
