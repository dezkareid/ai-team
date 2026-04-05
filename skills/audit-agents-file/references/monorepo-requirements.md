# Monorepo Requirements

If the project is a Monorepo (e.g., uses Turborepo, Nx, or pnpm workspaces), the root context file MUST contain the following Level 3 (###) sections under `## Project Structure` or `## Architecture`.

### 1. Workspace Architecture
**Criteria:**
- Must describe the high-level layout of the monorepo (e.g., "Apps live in `/apps`, shared packages in `/packages`").
- **Finding:** Report as **WARNING** if missing.

### 2. Dependency Hoisting Rules
**Criteria:**
- Must explain how dependencies are managed across the monorepo (e.g., "Install shared tooling at the root, app-specific dependencies in their respective workspaces").
- **Finding:** Report as **WARNING** if missing.

### 3. Cross-Package Linking
**Criteria:**
- Must specify how packages or apps consume internal workspace packages (e.g., "Use `workspace:*` versions in package.json").
- **Finding:** Report as **WARNING** if missing.