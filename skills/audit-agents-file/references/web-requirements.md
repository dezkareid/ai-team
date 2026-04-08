# Web Application Requirements

If the project is a web application (e.g., React, Next.js, Astro, Vue), the context file MUST contain the following Level 3 (###) sections under `## Coding Standards & Style` or `## Architecture`.

### 1. Routing Strategy
**Criteria:**
- Must explain the routing approach (e.g., Next.js App Router vs Pages Router, Astro file-based routing, React Router).
- **Finding:** Report as **WARNING** if missing.

### 2. State Management
**Criteria:**
- Must describe the state management libraries and conventions (e.g., "Use Zustand for global state, local state for UI components").
- **Finding:** Report as **WARNING** if missing.

### 3. Data Fetching & Mutations
**Criteria:**
- Must specify how data is fetched and mutated (e.g., "Use Server Actions for mutations, SWR for client fetching", "Use React Query").
- **Finding:** Report as **WARNING** if missing.

### 4. Styling System
**Criteria:**
- Must define the styling approach (e.g., "Use Tailwind CSS, avoid inline styles", "Use CSS Modules", "Use styled-components").
- **Finding:** Report as **WARNING** if missing.

### 5. Skills
**Criteria:**
- Must list the required skills the AI needs to effectively work on the web project (e.g., `performance`, `accessibility`, `seo`).
- **Finding:** Report as **ERROR** if missing.

### 6. MCPs
**Criteria:**
- Must list the required MCPs the AI needs to effectively work on the web project (e.g., `web-quality-audit`, `chrome-devtools`).
- **Finding:** Report as **ERROR** if missing.

### 7. Development Strategies
**Criteria:**
- Must define the development strategies and design approach (e.g., "Use mobile first design", "Use responsive design with breakpoints at 768px and 1024px").
- **Finding:** Report as **ERROR** if missing.