---
name: audit-agents-file
description: "Evaluates the structure and health of context files (AGENTS.md, README.md, etc.) within the project."
disable-model-invocation: true
metadata:
  version: "0.1.1"
---

## Overview

This skill provides the AI assistant with authoritative context and instructions on how to audit the structural health of context files. It ensures that documentation is consistent, complete, and follows the project's established standards, applying both universal rules and stack-specific requirements to the target file provided in the input.

## Universal Mandatory Sections

The target file MUST contain these foundational sections, regardless of the project type.

### 1. Mandatory Project Description
The file MUST start with a project description (Identity/Overview). This is usually the introductory text before the first Level 2 heading (##) or immediately following the main Level 1 title (#), or explicitly within `## Overview`.
**Criteria:**
- Presence of descriptive text (not just headers or metadata).
- **Finding:** Report as **ERROR** if missing.

### 2. Mandatory Level 2 (##) Sections
The file MUST contain the following Level 2 headers (or variations that clearly represent these concepts):
- `## Tech Stack & Versions` (e.g., Node/Python version, framework version, package manager)
- `## Project Structure` (e.g., where components, utilities, tests, and configurations live)
- `## Development Workflow` or `## Development` (e.g., how to start, build, format code)
- `## Testing Conventions` or `## Testing` (e.g., test runner, BDD vs TDD, naming conventions)
- `## Coding Standards & Style` or `## Coding Standards` (e.g., architectural opinions, strict rules)
- `## Debugging` or `## Troubleshooting` (e.g., verbose flags, log locations, common pitfalls)

**Criteria:**
- Each required concept must be addressed in a dedicated section or subsection.
- **Finding:** Report as **ERROR** if missing core sections. Report as **WARNING** if `## Debugging` is missing but other sections are present.

### 3. Formatting and Style
- All headers must be properly formatted with a space after the `#` characters (e.g., `## Section` instead of `##Section`).
- There should be no trailing whitespace on header lines.
- **Finding:** Report as **WARNING** if formatting is inconsistent.

## Contextual Stack-Specific Rules

Contextual rules are dynamically applied based on the project type. The AI must load the appropriate reference file if it detects a specific type of project.

- **Web Applications** (React, Vue, etc.): Load `references/web-requirements.md`
- **Next.js Applications**: Load `references/next-requirements.md`
- **Astro Applications**: Load `references/astro-requirements.md`
- **UI Libraries / Design Systems**: Load `references/ui-library-requirements.md`
- **CLI Applications**: Load `references/cli-requirements.md`
- **Monorepos** (Turborepo, Nx, pnpm workspaces): Load `references/monorepo-requirements.md`

## Audit Workflow

When asked to audit a context file:
1. **Identify Target File**: Identify the file path from the user's input. If no specific file is mentioned, default to `AGENTS.md` in the current directory or project root.
2. **Identify Project Type**: Look at `package.json`, `pnpm-workspace.yaml`, or other config files in the target file's directory (or project root) to determine the project type.
3. **Apply Core Rules**: Validate the presence of Universal Mandatory Sections in the **target file**.
4. **Apply Contextual Rules**: Load the specific reference file based on the project type and validate the mandatory sections within the **target file**.
5. **Generate a Report** with the following structure:
   - **Summary**: Target file path and overall health (Healthy / Needs Attention / Critical).
   - **Errors**: List of missing mandatory sections or descriptions (Core and Stack-Specific).
   - **Warnings**: List of formatting inconsistencies or missing highly-recommended sections.
   - **Action Items**: Clear instructions on how to fix the identified issues in the specific file.