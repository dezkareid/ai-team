# Plan: Define Dezkareid Enterprise Context and Product Characteristics

## Architecture Overview
The solution follows a hierarchical documentation structure designed for AI context consumption. We will introduce two new core context files and integrate them into the existing Model Context Protocol (MCP) server.

1.  **Context Hierarchy**:
    - `context/enterprise.md`: The root of the hierarchy. Contains mission, strategic goals, and enterprise-wide architecture characteristics (quality attributes).
    - `context/products.md`: Aligned with the enterprise. Describes the product portfolio (Personal Website, Collecstory) and their specific goals/characteristics.
2.  **MCP Integration**: The MCP server dynamically registers tools based on the `contextFiles` map in `.agent-structurerc`. We will update this configuration to expose the new files.
3.  **Refactoring**: Existing files `context/outcomes.md` and `context/architecture-principles.md` will be consolidated into the new structure to maintain a single source of truth.

## Implementation Phases

### Phase 1: Context Definition (Content Creation)
- **Step 1.1**: Create `context/enterprise.md`.
    - Define Mission: Empowering individuals and businesses through expert services and engaging platforms.
    - Define Strategic Goals: Quality, Innovation, Reliability.
    - Define Architecture Characteristics: Scalability, Security, Maintainability, Interoperability (aligned with business drivers).
- **Step 1.2**: Create `context/products.md`.
    - **Personal Website**: Mentoring, Consulting, Development services. Goals: Reputation, Knowledge Transfer.
    - **Collecstory**: Collectionism platform. Goals: User Engagement, Community Growth, Marketplace Trust.
- **Step 1.3**: Update/Consolidate `context/outcomes.md` and `context/architecture-principles.md`.
    - Move enterprise-wide content to `enterprise.md`.
    - Ensure these files remain as "legacy" or "redirect" pointers if needed, or remove them if fully superseded.

### Phase 2: MCP Server Integration
- **Step 2.1**: Update `.agent-structurerc`.
    - Add `get_enterprise_context` pointing to `context/enterprise.md`.
    - Add `get_products_context` pointing to `context/products.md`.
- **Step 2.2**: Run version synchronization and MCP distribution.
    - Execute `pnpm run sync-version` and `pnpm run distribute-mcp` to propagate changes to `gemini-extension.json` and Claude plugins.

### Phase 3: Validation & Verification
- **Step 3.1**: Verify MCP Server.
    - Start the MCP server locally (using `npx` or build+start) and verify that the new tools (`get_enterprise_context`, `get_products_context`) are registered.
- **Step 3.2**: Content Audit.
    - Review the new files to ensure they are 100% technology-agnostic and focus strictly on business/product logic.

## Technical Dependencies
- **Model Context Protocol (MCP)**: For exposing context to AI agents.
- **Zod**: Used in `src/mcp-server/config-schema.ts` for validating the configuration (may need updating if schema restricts keys).
- **TypeScript**: For any necessary MCP server script updates.

## Risks & Mitigations
- **Risk**: Redundancy between `enterprise.md` and legacy files.
  - **Mitigation**: Strictly move all content and use the new files as the primary source of truth.
- **Risk**: MCP Server tool name collisions.
  - **Mitigation**: Use descriptive, unique keys in `.agent-structurerc`.

## Out of Scope
- Implementation of any functional features for "Personal Website" or "Collecstory".
- Technology-specific architecture diagrams or implementation guides.
- Documentation for `ai-team` tooling itself.
