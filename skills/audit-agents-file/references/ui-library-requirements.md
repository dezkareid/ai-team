# UI Library Requirements

If the project is a UI Library (e.g., React components, Design System), the context file MUST contain the following Level 3 (###) sections under `## Coding Standards & Style` or `## Architecture`.

### 1. Component Architecture
**Criteria:**
- Must describe the architectural pattern for components (e.g., Atomic Design, Compound Components, Controlled vs. Uncontrolled).
- **Finding:** Report as **WARNING** if missing.

### 2. Design Tokens & Theme
**Criteria:**
- Must explain how colors, spacing, and typography are managed (e.g., "Uses the `design-tokens` skill", "Tailwind config", "CSS Variables").
- **Finding:** Report as **WARNING** if missing.

### 3. Testing (Visual & Unit)
**Criteria:**
- Must specify tools for visual regression and unit testing (e.g., Storybook Test Runner, Playwright, Vitest).
- **Finding:** Report as **WARNING** if missing.

### 4. Documentation & Storybook
**Criteria:**
- Must describe how components are documented and showcased (e.g., Storybook, Docusaurus).
- **Finding:** Report as **WARNING** if missing.

### 5. Skills
**Criteria:**
- Must list the required skills or MCPs the AI needs to effectively develop the UI library (e.g., `design-tokens`, `chrome-devtools`).
- **Finding:** Report as **ERROR** if missing.