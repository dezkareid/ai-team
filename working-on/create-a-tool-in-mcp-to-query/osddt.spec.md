# Specification: Design System MCP Tool

## Overview
A new MCP tool `query_design_system` will be added to the AI Team MCP server. This tool will provide AI agents with a single, authoritative point of access for design system context, including design tokens, component guidelines, and architectural layout principles. It will uniquely support an "override" mechanism, allowing agents to adapt global design standards to project-specific or context-specific requirements seamlessly.

## Requirements
1. **MCP Tool Interface**: Expose a tool named `query_design_system` that can be queried by any AI agent connected to the AI Team MCP server.
2. **Project-Scoped Configuration**: The tool must support a project-level configuration file (e.g., `ai-team-contextrc.json`) defined by the user within their project. This configuration allows specifying:
   - Custom paths for design tokens context.
   - Custom paths for component documentation context.
   - Specific overrides for tokens or styles.
3. **Context Retrieval**: The tool must fetch and return the content of the authoritative design system documentation (currently housed in `skills/design-tokens/` and its references) as a base.
4. **Context Merging**: If a project-scoped configuration is found or provided, the tool must merge the local project's tokens/components context and overrides with the base design system.
5. **AI-Ready Formatting**: The tool's response must be optimized for AI comprehension, using structured Markdown with clear demarcations between base standards and project-specific overrides.

## Scope
### In Scope
- Addition of the `query_design_system` tool to `src/mcp-server/index.ts`.
- Definition of a JSON schema for the project configuration file.
- Retrieval logic for existing design system files in `skills/design-tokens/`.
- Logic for merging/formatting base context with project-specific config in the tool response.

### Out of Scope
- Direct modification of the source-of-truth files in `skills/design-tokens/`.
- Implementation of a persistent database for overrides.
- Creation of new design system assets or actual UI components.

## Acceptance Criteria
- The `query_design_system` tool is successfully registered and discoverable in the AI Team MCP server.
- Executing the tool in a project with a `ai-team-contextrc.json` file returns the merged context (base + project overrides/paths).
- Executing the tool without a local config returns the complete base design system context.
- The response remains consistent with the existing documentation format (Markdown-focused).

## Decisions
1. **Configuration File**: The tool will look for a `ai-team-contextrc.json` file in the project root to determine overrides and custom context paths.
2. **Override Scope**: All overrides and custom paths are strictly scoped to the project where the configuration file resides.
3. **Component Context**: Documentation for components will be sourced from paths specified in the project configuration, defaulting to the local project directory if not specified.
