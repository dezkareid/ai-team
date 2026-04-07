---
metadata:
  name: "fsd-architecture"
  version: "1.1.0"
  description: "Comprehensive guide for Feature-Sliced Design (FSD) architecture in frontend projects"
---

# Feature-Sliced Design (FSD) Architecture

Expert procedural guidance for architecting frontend projects using the Feature-Sliced Design (FSD) methodology.

## Core Principles

1.  **Standardization**: Uniform structure for all projects, making it easy to onboard new developers.
2.  **Controlled Complexity**: Decomposing the project into layers, slices, and segments to manage scale.
3.  **Unidirectional Data Flow**: Higher layers can only depend on lower layers, preventing circular dependencies.
4.  **Business-Driven**: Organization based on business features and entities rather than technical roles.
5.  **Predictability**: Clear rules for where every piece of code belongs.

## The 6 Layers

1.  **App**: App-wide settings, styles, and providers.
2.  **Pages**: Full pages of the application.
3.  **Widgets**: Complex components that combine features and entities.
4.  **Features**: User interactions and actions that provide business value.
5.  **Entities**: Business logic and data models (e.g., User, Product, Order).
6.  **Shared**: Reusable UI components, helpers, and configuration.

## Rules

- **fsd-unidirectional-dependencies**: A layer can only import from layers below it (e.g., `Features` can import from `Entities`, but not from `Widgets`).
- **fsd-slice-isolation**: Slices within the same layer should not depend on each other.
- **fsd-public-api**: Every slice must have a public API (usually `index.ts`) that exports only what is necessary.

## References

- [Layers Definition](references/layers-definition.md)
- [Next.js Integration](references/nextjs-integration.md)
- [Cross-layer Communication](references/cross-layer-communication.md)
