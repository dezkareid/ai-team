# Feature Specification: Markdown Structure Evaluation Skill

## Overview
A new skill for AI agents (specifically Gemini CLI and Claude Code) to evaluate the structure of markdown context files. This ensures that documentation, enterprise context, and skill files maintain a consistent, machine-readable, and human-friendly format across the `ai-team` project.

## Requirements
- The skill must validate markdown files against a set of predefined structural rules.
- It should check for mandatory sections (e.g., `# Overview`, `## Requirements` in skill files).
- It should verify that frontmatter (YAML/TOML) is correctly formatted and contains required fields (e.g., `metadata.version`).
- It should identify broken links or references within the markdown files.
- It should provide clear, actionable feedback on what needs to be fixed.
- **Technology-Specific Guidance**: The skill must include rules to evaluate context for specific software pieces (e.g., web applications, packages) and technologies (e.g., "Astro", "Next.js", "CSS").
- **Software Type Guidance**: The skill must provide specific evaluation criteria based on the type of software (e.g., "Web Application", "Command Application", "Library/Package").
- **Agent Tools Context**: The skill must check for a section dedicated to AI agent tools and MCP servers, documenting their purpose and usage within the project.

## Scope
- **In-scope**:
  - Validation of `SKILL.md` files.
  - Validation of enterprise context files in `context/`.
  - Validation of command files if they use markdown.
  - Checks for headings, frontmatter, and link integrity.
- **Out-of-scope**:
  - Spell checking or grammar analysis.
  - Automatic fixing of structural issues (only evaluation).
  - Validation of non-markdown files.

## Acceptance Criteria
- A new skill `context-evaluator` (or similar) is registered in the project.
- Running the skill against a valid `SKILL.md` returns a success message.
- Running the skill against a malformed `SKILL.md` (e.g., missing `# Overview`) returns a specific error message.
- The skill correctly parses frontmatter and validates required version fields.
- The skill can be invoked via standard agent skill mechanisms.

## Decisions
1. **Plugin Selection**: The skill should be part of a new `context-tools` plugin.
2. **Mandatory Sections**: The skill focuses on checking sections to ensure enough context for application/package/tool quality, organized from "usage" and "development" perspectives. It does not consider the `context/` folder.
3. **Parsing Library**: No specific parsing library is needed; the skill consists of instructions for agents.
