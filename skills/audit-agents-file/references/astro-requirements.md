# Astro Application Requirements

If the project is an Astro application, the context file MUST contain the following Level 3 (###) sections under `## Coding Standards & Style` or `## Architecture`.

### 1. Islands Architecture
**Criteria:**
- Must explain which frameworks are integrated (React, Vue, Svelte) and how hydration is managed (e.g., `client:load`, `client:visible`).
- **Finding:** Report as **WARNING** if missing.

### 2. Content Collections
**Criteria:**
- Must describe how content is structured and queried (e.g., Markdown, MDX, Content Collections API).
- **Finding:** Report as **WARNING** if missing.

### 3. Integrations (React, Tailwind, etc.)
**Criteria:**
- Must list the official and community integrations in use and their specific configuration rules.
- **Finding:** Report as **WARNING** if missing.

### 4. Deployment & Adapters
**Criteria:**
- Must specify the target platform (Vercel, Netlify, Cloudflare) and the adapter being used (e.g., `@astrojs/vercel`).
- **Finding:** Report as **WARNING** if missing.

### 5. Skills
**Criteria:**
- Must list the required skills or MCPs the AI needs to effectively develop the Astro application (e.g., `web-quality-audit`, `performance`).
- **Finding:** Report as **ERROR** if missing.