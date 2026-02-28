# Architecture Principles

## Core Principles
1. **Simplicity over Complexity**: Prefer simple, maintainable solutions over complex ones. Avoid over-engineering.
2. **Configuration-Driven**: Design systems to be behaviorally controlled via configuration rather than hardcoded logic.
3. **Stateless by Default**: Aim for stateless services to improve scalability and simplify deployment.
4. **Documentation as Code**: Maintain technical documentation close to the code it describes (e.g., Markdown files in the repository).

## Standards
- **Language**: TypeScript is the primary language for all tooling.
- **Protocol**: Use Model Context Protocol (MCP) for exposing internal context to AI agents.
- **Testing**: All new features must include unit and/or integration tests.
