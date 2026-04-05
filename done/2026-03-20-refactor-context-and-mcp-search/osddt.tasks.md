# Tasks: Refactor Enterprise Context and MCP Search Tool

## Phase 1: Context Refactoring (Content Creation)
- [x] [S] Update `context/enterprise.md` with quality drivers (Perf, A11y, SEO).
- [x] [S] Refactor `context/outcomes.md` and `context/architecture-principles.md` to be tech-agnostic and enterprise-wide.
- [x] [S] Create `context/products/` directory and populate it with `personal-website.md`, `collecstory.md`, and `default.md`.
- [x] [S] Final content audit: No mentions of specific technologies or `ai-team` tooling.

## Phase 2: MCP Server Implementation
- [x] [M] Implement `search_product` tool in `src/mcp-server/index.ts` with input validation (zod).
- [x] [S] Implement fallback logic with "The products was not found but..." message.
- [x] [S] Update `.agent-structurerc` contextFiles mapping.

## Phase 3: Synchronization & Verification
- [x] [S] Build the project and run `sync-version` / `distribute-mcp`.
- [x] [S] Verify that `gemini-extension.json` and `.mcp.json` are in sync.

## Definition of Done
- Enterprise context files (`enterprise.md`, `outcomes.md`, `architecture-principles.md`) are purely business-aligned and technology-agnostic.
- Each product has a dedicated Markdown file in `context/products/`.
- The MCP server successfully provides the `search_product` tool with a correct fallback mechanism.
