# Specification: Refactor Enterprise Context and MCP Search Tool

## Overview
This feature refactors the **Dezkareid Enterprise** context documentation to include core quality drivers (Performance, Accessibility, SEO) and moves to a hierarchical, per-product documentation structure. It also implements a dynamic `search_product` tool in the MCP server to efficiently retrieve these characteristics while maintaining a technology-agnostic foundation.

## Requirements
- **Quality Drivers**: Formally incorporate Performance, Accessibility, and SEO into the Enterprise strategic goals and architecture characteristics.
- **Product-Specific Documentation**: Split the consolidated products file into individual Markdown files located in `context/products/`.
- **Default Product Context**: Provide a `default.md` for products not yet specifically documented, ensuring a fallback for AI agents.
- **Dynamic MCP Tool**: Implement `search_product(productName)` in the MCP server to dynamically find and return the relevant product characteristics.
- **Fall-back Messaging**: When a product is not found, the tool must return the default characteristics with a clear message: "The products was not found but...".
- **Technology-Agnostic Context**: Ensure all documentation in the `context/` folder focuses strictly on business and product logic, excluding technical implementation details like `ai-team` or distribution configs.

## Dezkareid Enterprise Portfolio
1. **Personal Website**: Consulting, Development, Mentoring.
2. **Collecstory**: Collectionism social platform and marketplace.

## Scope
- **In-Scope**:
    - Updating `context/enterprise.md`, `context/outcomes.md`, and `context/architecture-principles.md` with new quality drivers and enterprise-wide standards.
    - Implementing the per-product file structure in `context/products/`.
    - Modifying `src/mcp-server/index.ts` to include the `search_product` tool.
    - Synchronizing configurations via `pnpm run distribute-mcp`.
- **Out-of-Scope**:
    - Adding new functional product features.
    - Including technical implementation details in the context Markdown files.

## Acceptance Criteria
- `context/enterprise.md` includes Performance, Accessibility, and SEO as core characteristics.
- `context/products/` contains `personal-website.md`, `collecstory.md`, and `default.md`.
- `get_products_context` is removed from `.agent-structurerc` in favor of the dynamic `search_product` tool.
- The `search_product` tool correctly returns the specific product or the default fallback with the required message.
- All context documents are technology-agnostic.
