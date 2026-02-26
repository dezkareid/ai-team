# Specification: Design System Skill

## Overview
The Design System Skill provides an AI assistant with authoritative context regarding the design tokens of the project. By informing the AI about available colors, spacings, and breakpoints, it can generate code and provide recommendations that are consistent with the established design system, reducing design-to-code friction.

## Requirements
- **Color Retrieval**: The skill must inform the AI about the primary, secondary, and utility color palettes, including semantic names and their corresponding values (HEX, RGB, or CSS variables).
- **Spacing Guidelines**: The skill must define the spacing scale used in the project (e.g., 4px grid) and the semantic aliases (e.g., `spacing-sm`, `spacing-md`).
- **Breakpoint Definitions**: The skill must provide the responsive breakpoints (e.g., `mobile`, `tablet`, `desktop`) and their pixel thresholds.
- **AI Instructions**: The skill must include instructions for the AI on how to prefer these tokens over hardcoded values in its output.

## Scope
- **In Scope**:
  - Definition of core design tokens: colors, spacing, and breakpoints.
  - Instructions for AI application of these tokens.
  - A Markdown/TOML-based skill definition compatible with the AI agent.
- **Out of Scope**:
  - Dynamic token management or synchronization with external design tools (e.g., Figma).
  - Typography, shadows, animations, or complex design elements (to be added in future iterations).
  - Automatic modification of existing codebase to apply these tokens.

## Acceptance Criteria
- An AI assistant activated with this skill can correctly identify and use a color token from the system in a code snippet.
- An AI assistant activated with this skill can correctly identify and use a spacing constant in a layout suggestion.
- An AI assistant activated with this skill can correctly identify and use a breakpoint in a media query suggestion.
- The skill file follows the project's standard command/skill format.

## Decisions
1. **Source of truth for tokens**: Tokens are referenced from the `@dezkareid/design-tokens` package, specifically the `dist/catalogs/all-tokens-css.md` file.
2. **Target framework/system**: The implementation targets pure CSS using custom properties (CSS variables).
