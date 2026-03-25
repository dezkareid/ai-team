# Implementation Plan: Design System MCP Tool

## Architecture Overview
The `query_design_system` tool will be implemented as a new tool in the `ai-team` MCP server (`src/mcp-server/index.ts`). It will follow a layered approach for context retrieval:
1. **Base Context**: Load core design system documentation from `skills/design-tokens/` and the newly installed `@dezkareid/components` README.
2. **Project Configuration**: Scan for `ai-team-contextrc.json` in the current working directory of the caller.
3. **Custom Context & Overrides**: If the config exists, resolve custom paths for tokens/components and extract explicit overrides.
4. **Context Merging**: Merge the base context with project-specific additions, ensuring overrides are clearly prioritized in the final Markdown response.

The implementation will also involve updating the existing `design-tokens` skill to include references to the newly added `@dezkareid/components` library.

## Implementation Phases

### Phase 1: Environment & Dependency Setup
- [ ] Confirm `@dezkareid/components` is correctly installed in `package.json`.
- [ ] Update `skills/design-tokens/SKILL.md` to include references to the component library.
- [ ] Create a new reference file `skills/design-tokens/references/components.md` containing the component documentation extracted from the package README.

### Phase 2: Configuration & Utility Logic
- [ ] Define a TypeScript interface/Zod schema for `ai-team-contextrc.json`.
- [ ] Implement a utility function to locate and parse `ai-team-contextrc.json` starting from the current directory.
- [ ] Implement a helper function to merge base context with custom project paths and overrides.

### Phase 3: MCP Tool Registration
- [ ] Register the `query_design_system` tool in `src/mcp-server/index.ts`.
- [ ] Implement the tool's handler logic:
    - Load base tokens and component context.
    - Check for project-level config.
    - Resolve and read custom context paths (if any).
    - Format the final output as a structured Markdown document.

### Phase 4: Validation & Testing
- [ ] Create a test project directory with a sample `ai-team-contextrc.json`.
- [ ] Verify the tool returns base context when no local config is present.
- [ ] Verify the tool correctly merges and displays overrides when a local config is provided.
- [ ] Run the project build (`npm run build`) and linting to ensure no regressions.

## Technical Dependencies
- `@dezkareid/components`: Source for component documentation.
- `fs-extra`: For robust file system operations.
- `zod`: For validating the project configuration file.
- `path`: For safe cross-platform path resolution.

## Risks & Mitigations
- **Risk**: The caller's current working directory might not be the project root, leading to missing config files.
  - **Mitigation**: Implement a recursive search upwards from the CWD to find the nearest `ai-team-contextrc.json`.
- **Risk**: Overrides might be complex and difficult to merge cleanly in Markdown.
  - **Mitigation**: Use a clear "OVERRIDES ACTIVE" section at the top of the response to ensure the AI agent prioritizes them.
- **Risk**: Large documentation files could exceed MCP response limits.
  - **Mitigation**: Implement basic truncation or summarize sections if the total character count exceeds a reasonable threshold (e.g., 30,000 characters).

## Out of Scope
- Automatic application of overrides to CSS files.
- Persistent storage of project overrides on the MCP server.
- Support for multiple configuration files in the same project.
