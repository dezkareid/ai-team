# CLI Application Requirements

If the project is a CLI application, the context file MUST contain the following Level 3 (###) sections under `## Coding Standards & Style` or `## Architecture`.

### 1. Argument Parsing
**Criteria:**
- Must explain how CLI arguments are parsed (e.g., "We use Commander.js", "We use yargs").
- **Finding:** Report as **WARNING** if missing.

### 2. I/O & Logging
**Criteria:**
- Must specify how logging and standard output are handled (e.g., "Never use console.log directly; use our custom Logger utility for standard streams").
- **Finding:** Report as **WARNING** if missing.

### 3. Distribution / Compilation
**Criteria:**
- Must describe how the CLI binary is built and published (e.g., "Built with tsup, published via npm publish", "Compiled with Go").
- **Finding:** Report as **WARNING** if missing.