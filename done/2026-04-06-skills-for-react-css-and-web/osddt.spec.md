# Feature Specification: Skills for React, Styles, and Frontend Architecture (FSD)

## Overview
This feature aims to create a set of AI skills that improve code maintainability and standardize development practices with company standards. These skills will serve as expert procedural guidance for AI agents to build components, manage styles, and architect frontend projects using a structured methodology.

## Requirements
- **React Component Building Skill**: Define a standardized approach for building React components, including patterns for props, state, composition, and hooks. It should teach agents how to create components that are reusable, testable, and maintainable.
- **Styles Methodology Skill**: Establish a methodology for writing and organizing styles. This includes naming conventions (e.g., BEM), file structure, and the use of Vanilla CSS (as per project mandates) for consistent and performant styling, with the flexibility to support other formats like SASS in the future.
- **Feature-Sliced Design (FSD) Skill**: Provide guidance on implementing Feature-Sliced Design architecture in frontend projects. This should cover the layers (app, processes, pages, features, entities, shared), slices, and segments, as well as the rules for cross-layer communication.
- **Maintainability & Standardization**: All skills must be designed to promote clean code and consistency across the codebase.

## Scope
- **In-Scope**:
  - Creation of `skills/react-components/SKILL.md` and related references.
  - Creation of `skills/styles-methodology/SKILL.md` and related references.
  - Creation of `skills/fsd-architecture/SKILL.md` and related references.
  - Registration of these skills in the project configuration (`.agent-structurerc`).
  - Exporting these skills for Gemini and Claude.
- **Out-of-Scope**:
  - Refactoring existing projects to follow these new skills (this is an enablement task).
  - Implementation of new application features.

## Acceptance Criteria
- [ ] `skills/react-components/SKILL.md` exists and contains expert guidance on building components.
- [ ] `skills/styles-methodology/SKILL.md` exists and defines the standard styling approach.
- [ ] `skills/fsd-architecture/SKILL.md` exists and provides a comprehensive guide to Feature-Sliced Design.
- [ ] All new skills are registered in `.agent-structurerc` and successfully exported via `pnpm run export-claude`.
- [ ] Each skill follows the project's standard structure (frontmatter, references, versioning).

## Session Context
The requirements were refined to specifically address:
1.  **React**: Building components.
2.  **Styles**: Methodology for writing and organizing styles.
3.  **Architecture**: Feature-Sliced Design (FSD).

## Decisions
1. **Styles Methodology**: Use BEM for naming styles, and organize styles using Object-Oriented CSS (OOCSS) principles to divide them.
2. **FSD Layers**: The "processes" layer is deprecated; use App, Pages, Widgets, Features, Entities, and Shared.
