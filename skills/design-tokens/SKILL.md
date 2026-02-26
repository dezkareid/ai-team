---
name: design-tokens
description: "Authoritative context for the project's design tokens. Provides information on colors, spacing, and breakpoints using CSS custom properties."
---

## Overview

This skill provides the AI assistant with authoritative context regarding the project's design tokens. It ensures that any generated code or design recommendations are consistent with the established design system.

## Source of Truth

The design tokens are defined in the following catalog:
- [all-tokens-css](references/all-tokens-css.md)

You MUST refer to this file to identify available color palettes, spacing scales, and breakpoints.

## Usage Guidelines

### 1. Prefer Tokens Over Hardcoded Values
When generating CSS or inline styles, you MUST prefer using CSS custom properties (variables) defined in the design system instead of hardcoded HEX, RGB, or pixel values.

**Bad:**
```css
.button {
  background-color: #007bff;
  padding: 16px;
}
```

**Good:**
```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-md);
}
```

### 2. Colors
Use semantic names for colors whenever possible (e.g., `--color-primary`, `--color-secondary`, `--color-error`). Refer to `references/all-tokens-css.md` for the full list of available semantic and numeric scales.

### 3. Spacing
The project uses a consistent spacing scale. Use the `--spacing-*` variables for margins, paddings, and gaps.

### 4. Breakpoints
For responsive design, use the established breakpoints in your media queries.
Example:
```css
@media (min-width: var(--breakpoint-tablet)) {
  /* ... */
}
```
