---
name: audit-agents-file
description: "Evaluates the structure and health of AGENTS.md files within the project."
---

## Overview

This skill provides the AI assistant with authoritative context and instructions on how to audit the structural health of `AGENTS.md` files. It ensures that agent documentation is consistent, complete, and follows the project's established standards.

## Audit Rules

### 1. Mandatory Project Description
The file MUST start with a project description. This is usually the introductory text before the first Level 2 heading (##) or immediately following the main Level 1 title (#).

**Criteria:**
- Presence of descriptive text (not just headers or metadata).
- **Finding:** Report as **ERROR** if missing.

### 2. Mandatory Level 2 (##) Sections
The file MUST contain the following Level 2 headers exactly as written:
- `## Overview`
- `## Development`
- `## Testing`
- `## Documentation`

**Criteria:**
- Each section must exist as a Level 2 header.
- **Finding:** Report as **ERROR** if any are missing.

### 3. Formatting and Style
- All headers must be properly formatted with a space after the `#` characters (e.g., `## Section` instead of `##Section`).
- There should be no trailing whitespace on header lines.
- **Finding:** Report as **WARNING** if formatting is inconsistent.

## Audit Workflow

When asked to audit an `AGENTS.md` file:
1. Read the entire content of the file.
2. Check against each of the **Audit Rules** above.
3. Generate a report with the following structure:
   - **Summary**: Overall health of the file (Healthy / Needs Attention / Critical).
   - **Errors**: List of missing mandatory sections or descriptions.
   - **Warnings**: List of formatting inconsistencies.
   - **Action Items**: Clear instructions on how to fix the identified issues.
