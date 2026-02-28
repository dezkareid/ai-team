# ai-team

Repository with AI tooling for teams — Gemini CLI extensions and Claude Code marketplace plugins.

## Gemini CLI

### Installation

```bash
gemini extensions install https://github.com/dezkareid/ai-team
```

## Claude Code

### Install the marketplace

Add this marketplace to Claude Code so it can discover the available plugins:

```bash
claude marketplace add dezkareid-ai-team https://github.com/dezkareid/ai-team
```

### Available plugins

#### `npm-tools` — Tools for working with npm

| Command | Description |
|---|---|
| `npm-package-setup` | Initialize and publish a new npm package. |
| `npm-publish` | Setup NPM publication workflow with OIDC and provenance using local standard actions (Monorepo & pnpm support). |

#### `design-system` — Authoritative design system context and tools

#### `company-context` — Authoritative company context and tools

### Install a plugin

Once the marketplace is added, install a plugin with:

```bash
claude plugin install npm-tools
claude plugin install design-system
claude plugin install company-context
```

### Use a command

Invoke any installed command directly from Claude Code:

```
/npm-package-setup my-lib 0.1.0 "A utility library"
/npm-publish
```
