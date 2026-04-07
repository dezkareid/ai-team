---
metadata:
  name: "react-components"
  version: "1.0.0"
  description: "Expert guidance for building standardized and extensible React components"
---

# React Component Building

Expert procedural guidance for building standardized, maintainable, and extensible React components.

## Core Principles

1.  **TypeScript-First**: Always use TypeScript for strong typing and better developer experience.
2.  **Extensibility**: Components based on HTML elements should always extend the corresponding HTML attributes.
3.  **Composition over Inheritance**: Use component composition to build complex UIs from simpler building blocks.
4.  **Single Responsibility**: Each component should have a single, clear purpose.
5.  **Predictable Props**: Use consistent naming conventions for props (e.g., `on[Action]` for event handlers).

## Rules

- **react-html-extensibility**: When building a component that renders a standard HTML element, always include its native attributes in the props definition using `React.HTMLAttributes<T>` or specific variants.
- **react-ref-prop**: In React 19+, pass `ref` directly as a prop to components that wrap native HTML elements. `forwardRef` is deprecated.
- **react-prop-standardization**: Follow standard prop naming for common UI patterns (e.g., `isOpen`, `isDisabled`, `children`).

## References

- [HTML Attributes Extensibility](references/html-attributes.md)
- [Composition Patterns](references/composition-patterns.md)
