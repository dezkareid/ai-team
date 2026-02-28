# Agent Instructions: AI Team Project

This project is a collection of AI utils like agents/commands/skills and more that are intended to be used together to use AI tools more effectively.

## Overview

Support different AI agents/commands/skills formats:

### Command File Formats

#### Markdown Format

Used by: Claude Code, Cursor, opencode, Windsurf, Amazon Q Developer, Amp, SHAI, IBM Bob

**Standard format:**

Used by Claude Code

```markdown
---
description: "Command description"
---

Command content with {SCRIPT} and $ARGUMENTS placeholders.
```

#### TOML Format

Used by: Gemini

```toml
description = "Command description"

prompt = """
Command content with {SCRIPT} and {{args}} placeholders.
"""
```

### Organization


### Argument Patterns

Different agents use different argument placeholders:

- **Markdown/prompt-based**: `$ARGUMENTS`
- **TOML-based**: `{{args}}`

## Development

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

File `.agent-structurerc` is used to configure the project structure.

```json
{
    "claude-plugins": {
        "npm-tools": {
            "name": "npm-tools",
            "description": "Tools for working with npm"
        }
    },
    "commands": [
        {
            "id": "npm-package-setup",
            "source": "npm/package-setup.toml",
            "claude-plugin": "npm-tools"
        }
    ]
}
```

### Claude Plugin Structure

```
plugins/
└── <claude-plugin>/
    ├── .claude-plugin/
    │   ├── plugin.json
    ├──commands/
    │   ├── <command-name>.md
```

### Commit Rules

Always use Conventional Commits format for commit messages.

Never commit directly to `main` or `master`. If the current branch is one of them, propose creating a new branch before committing.

### Critical Dependency Versions

The following versions are established across the project's packages and should be respected when adding new dependencies or troubleshooting.

Always prefer use exact versions for dependencies. Do not use `^` or `~`.

#### Core Languages & Runtimes
- **TypeScript**: `5.9.3`

#### Build & Bundling Tools
- **Rollup**: `4.56.0`

#### Testing Frameworks
- **Vitest**: `4.0.18`

#### Linting & Formatting
- **ESLint**: `9.39.2`

#### Type Definitions
- **@types/node**: `25.0.10`
- **@types/fs-extra**: `11.0.4`

### Project Structure & Conventions
- **Package Manager**: `pnpm` is the required package manager.

## Testing

### Approach

Tests are written using **Vitest** and follow **BDD (Behaviour-Driven Development)** conventions:
