# Next.js Application Requirements

If the project is a Next.js application, the context file MUST contain the following Level 3 (###) sections under `## Coding Standards & Style` or `## Architecture`.

### 1. Rendering Patterns
**Criteria:**
- Must explain the rendering strategy (e.g., SSR, SSG, ISR, Client-side only) and clarify usage of React Server Components (RSC) boundaries.
- **Finding:** Report as **WARNING** if missing.

### 2. API Routes & Server Actions
**Criteria:**
- Must define how backend logic is structured (e.g., API routes in `/api`, Server Actions in `actions/`).
- **Finding:** Report as **WARNING** if missing.

### 3. Middleware & Authentication
**Criteria:**
- Must describe the authentication flow and any middleware used (e.g., NextAuth.js, Clerk, custom middleware).
- **Finding:** Report as **WARNING** if missing.

### 4. Image & Font Optimization
**Criteria:**
- Must specify rules for using `next/image` and `next/font` (e.g., "Always use `next/font/google`", "Local image optimization rules").
- **Finding:** Report as **WARNING** if missing.

### 5. Skills
**Criteria:**
- Must list the required skills or MCPs the AI needs to effectively work on the Next.js app (e.g., `next-best-practices`, `react-best-practices`, `chrome-devtools`).
- **Finding:** Report as **ERROR** if missing.