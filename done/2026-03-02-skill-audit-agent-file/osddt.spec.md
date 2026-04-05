# Feature Specification: AGENTS.md Skill Audit

## Overview
This feature introduces a new skill to evaluate and audit the structure of `AGENTS.md` files within the project. As the project grows, maintaining consistent and well-structured documentation for AI agents is crucial for reliable and predictable agent behavior. This skill will provide automated validation to ensure these files adhere to the project's established standards.

## Requirements
- The skill must be able to parse and analyze `AGENTS.md` files.
- The skill must identify missing required sections or mandatory formatting.
- The skill must provide clear, actionable feedback when inconsistencies or errors are found.
- The skill must be easily invocable within the existing agent/skill framework.

## Scope
- **In-scope**:
  - Validation of `AGENTS.md` structure (headers, required sections).
  - Checking for consistency with project-wide agent conventions.
  - Reporting errors and warnings to the user.
- **Out-of-scope**:
  - Automatically fixing the `AGENTS.md` files (this should be a manual or separate process).
  - Validation of logic or code referenced within `AGENTS.md` (only the structure of the document itself).

## Acceptance Criteria
- A user can run the audit skill on an `AGENTS.md` file and receive a report of its structural health.
- The report correctly identifies missing mandatory headers (e.g., # Agent Instructions, ## Overview).
- The skill fails gracefully if the file is not found or is unreadable.
- The skill is registered and discoverable within the project's skill system.

## Session Context
- The feature name was refined to `feat/skill-audit-agent-file`.
- The primary goal is to provide a tool for evaluating the structure of `AGENTS.md` files.

## Decisions
1. **Mandatory sections/rules**: Should have a description about the project, sections mandatory are "Overview", "Development", "Testing", "Documentation"
2. **Audit triggers**: Manual only
3. **Version support**: No
