# Plan: Refactor Enterprise Context and MCP Search Tool

## Architecture Overview
The architecture is evolved to a more scalable, dynamic model where product-specific characteristics are separated into individual files and accessed via a custom MCP tool.

1.  **Context Refactoring**:
    - **Enterprise Level**: `context/enterprise.md`, `context/outcomes.md`, and `context/architecture-principles.md` are updated to focus on high-level enterprise outcomes, quality drivers (Perf, A11y, SEO), and business-aligned principles, completely removing technical detail.
    - **Product Level**: Product-specific logic is moved to `context/products/*.md`.
2.  **MCP Server Update**:
    - Introduce `search_product(productName)` tool to dynamically search the `context/products/` directory.
    - Implement a fallback mechanism to `context/products/default.md` with specific messaging.
3.  **Sync & Distribution**: Use existing project scripts (`sync-version`, `distribute-mcp`) to maintain consistency.

## Implementation Phases

### Phase 1: Context Refactoring (Completed)
- **Step 1.1**: Update `context/enterprise.md` with Quality Drivers (Performance, Accessibility, SEO).
- **Step 1.2**: Refactor `context/outcomes.md` and `context/architecture-principles.md` to be technology-agnostic and enterprise-wide.
- **Step 1.3**: Create `context/products/` directory and split `products.md` into `personal-website.md`, `collecstory.md`, and `default.md`.

### Phase 2: MCP Server Implementation (Completed)
- **Step 2.1**: Update `src/mcp-server/index.ts` to include the `search_product` tool with `zod` input validation.
- **Step 2.2**: Implement logic to handle file search and default fallback with messaging.
- **Step 2.3**: Update `.agent-structurerc` to remove the old consolidated products context mapping.

### Phase 3: Synchronization & Audit (Completed)
- **Step 3.1**: Run `pnpm run build` and `pnpm run distribute-mcp` to update external configurations.
- **Step 3.2**: Audit all files to ensure no technology-specific details remain in the context documentation.

## Technical Dependencies
- **Model Context Protocol (MCP)** for context distribution.
- **Zod** for tool argument validation.
- **Node.js fs** for dynamic file searching.

## Risks & Mitigations
- **Risk**: Agents might not find a product due to naming mismatches.
  - **Mitigation**: Implement normalization (lowercase, kebab-case) in the `search_product` tool and provide a clear fallback message.

## Out of Scope
- Technical documentation for `ai-team` tooling itself.
- Functional development of products.
