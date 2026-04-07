---
metadata:
  name: "styles-methodology"
  version: "1.0.1"
  description: "Standard methodology for writing and organizing styles using BEM and OOCSS"
---

# Styles Methodology

Expert procedural guidance for writing maintainable and scalable styles using BEM naming and OOCSS principles.

## Core Principles

1.  **BEM (Block Element Modifier)**: Use a standardized naming convention to prevent style leaks and improve clarity.
2.  **OOCSS (Object-Oriented CSS)**: Separate layout (structure) from skin (visuals) to increase code reuse.
3.  **Vanilla CSS First**: Prioritize Vanilla CSS for compatibility, while structuring code for potential SASS migration.
4.  **No Direct Element Styling**: Avoid styling base tags (like `h1`, `p`) directly within components; use class names.
5.  **Single Responsibility**: A class should do one thing well.

## Rules

- **styles-bem-naming**: Follow the `block__element--modifier` naming convention strictly.
- **styles-oocss-separation**: Separate structural classes (e.g., `.grid`, `.media`) from visual classes (e.g., `.theme-dark`, `.border-soft`).
- **styles-no-nesting-leaks**: Avoid deep nesting or specific selector chains that make overrides difficult.

## References

- [BEM Naming Convention](references/naming-bem.md)
- [OOCSS Organization](references/organization-oocss.md)
- [Future-proofing for SASS](references/future-sass.md)
