# Implementation Plan: MCP for Company Context

## Architecture Overview
The system will be a TypeScript-based MCP server using the `@modelcontextprotocol/sdk`. It will act as a bridge between the filesystem and AI agents.

- **Configuration-Driven**: A `mcp-context-config.json` file will specify which local documents (Markdown, JSON, etc.) are exposed as MCP tools or resources.
- **Source of Truth**: All context documents will reside in a `context/` folder in the project's root directory.
- **Stateless Operation**: The server will read files on-demand or at startup, ensuring it doesn't maintain complex internal state.
- **Transport**: Standard MCP transport (Stdio) for compatibility with most MCP clients.

## Implementation Phases

### Phase 1: Project Setup & Scaffolding
- Create the project directory structure.
- Initialize `package.json` and `tsconfig.json`.
- Install dependencies: `@modelcontextprotocol/sdk`, `zod`, `fs-extra`.

### Phase 2: Data & Configuration
- Define the schema for `mcp-context-config.json`.
- Create the `context/` directory in the root.
- Add initial context files: `context/outcomes.md` (Company Outcomes) and `context/architecture-principles.md` (Architecture Principles).

### Phase 3: MCP Server Logic
- Implement the configuration loader.
- Create an MCP server instance.
- Register tools (e.g., `get_company_outcomes`, `get_architecture_principles`) that read from the configured files in the `context/` folder.
- Implement error handling for missing files or invalid configuration.

### Phase 4: Validation
- Test the server using the MCP Inspector.
- Verify that changes to the configuration or documents are reflected in the server's output.

## Technical Dependencies
- `@modelcontextprotocol/sdk`: Official SDK.
- `typescript`: Language.
- `zod`: For validating the JSON configuration.
- `fs-extra`: For filesystem access.

## Risks & Mitigations
- **Configuration Errors**: Invalid JSON could crash the server. *Mitigation*: Use Zod for strict validation at startup.
- **File Access**: Potential for exposing files outside the intended directory. *Mitigation*: Ensure the server only serves files explicitly listed in the configuration and within the `context/` folder.

## Out of Scope
- Integration with external APIs (SaaS tools).
- GUI for managing the context documents.
- Authentication/Authorization layers beyond MCP defaults.
