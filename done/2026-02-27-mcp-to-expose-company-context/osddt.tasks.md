# Task List: MCP for Company Context

## Phase 1: Project Integration & Scaffolding
- [x] [S] Add `@modelcontextprotocol/sdk` and `zod` to `package.json` dependencies.
- [x] [S] Create the `src/mcp-server` directory for the server source code.
- [x] [S] Update `rollup.config.js` to include a build target for the MCP server.
- [x] [S] Create a basic `src/mcp-server/index.ts` entry point.

**Definition of Done**: Dependencies are added, and the build system is configured to handle the MCP server. (Phase 1 Complete)

## Phase 2: Data & Configuration
- [x] [S] Create the `plugins/company-context/` directory structure, including `.claude-plugin/plugin.json`.
- [x] [S] Define Zod schema for the `mcpServers` and `claude-plugins` configuration in `.agent-structurerc`.
- [x] [S] Create the `context/` directory in the root.
- [x] [S] Add `context/outcomes.md` with sample company outcomes.
- [x] [S] Add `context/architecture-principles.md` with sample principles.

**Definition of Done**: Plugins directory and initial context documents are in place. (Phase 2 Complete)

## Phase 3: MCP Server Logic
- [x] [M] Implement configuration loader that reads from `.agent-structurerc`, specifically the `mcpServers` section.
- [x] [S] Implement a utility function to check if a file exists before attempting to read it.
- [x] [M] Initialize the MCP server and register tools/resources based on the context files mapping.
- [x] [M] Implement tool handlers that read file content and handle "file not found" errors gracefully.
- [x] [S] Add unit tests for the file existence utility and configuration loader.

**Definition of Done**: MCP server is implemented and correctly maps tools to context files using `.agent-structurerc`. (Phase 3 Complete)

## Phase 4: Integration & Tooling
- [x] [M] Update `src/scripts/sync-version.ts` to synchronize versions across `package.json`, `claude-plugins`, `mcpServers` in `.agent-structurerc`, and `.claude-plugin/marketplace.json`.
- [x] [M] Implement a script to distribute MCP configurations from `.agent-structurerc` to `gemini-extension.json` and `plugins/company-context/mcp.json`.
- [x] [S] Update `package.json` scripts to include the new synchronization and distribution tasks.

**Definition of Done**: MCP server configuration and plugin metadata are synchronized and distributed across all relevant files. (Phase 4 Complete)

## Phase 5: Validation & Verification
- [x] [M] Build the project and run the server via Stdio.
- [x] [S] Validate the server using the MCP Inspector.
- [x] [S] Verify that the server correctly reports an error if a configured file is missing.
- [x] [S] Confirm that AI agents (Gemini and Claude) can successfully retrieve content from the `context/` folder using the distributed configuration.

**Definition of Done**: Server and distribution scripts are verified to work as expected. (Phase 5 Complete)

## Dependencies
- Phase 1 must be completed before all others.
- Phase 2 provides the data for Phase 3.
- Phase 3 must be completed before Phase 4.
