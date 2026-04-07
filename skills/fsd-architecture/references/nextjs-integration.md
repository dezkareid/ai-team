# Next.js 16 Integration with FSD

Integrating Feature-Sliced Design (FSD) with Next.js 16 requires careful planning to avoid naming conflicts between FSD layers and Next.js reserved file-system routing folders (like `app/` or `api/`).

## 1. Root-Based Structure

In Next.js 16, the `app/` directory is located at the root of the project. To maintain FSD standardization, all FSD layers should also be placed at the root level. This provides direct access to all architectural components without the `src/` wrapper.

```text
root/
├── app/          (Next.js App Router + FSD App Layer)
├── widgets/      (FSD Layer)
├── features/     (FSD Layer)
├── entities/     (FSD Layer)
├── shared/       (FSD Layer)
├── pages/        (FSD Layer - See Conflict section below)
├── public/
├── next.config.js
└── package.json
```

## 2. Resolving the `app/` Conflict

Next.js App Router uses an `app/` directory for routing. FSD also has an `app` layer for global initialization.

### The Hybrid Approach
The root `app/` directory serves both as the **FSD App Layer** and the **Next.js Routing Entry Point**.

- **Next.js role**: Define `layout.tsx`, `page.tsx`, and error boundaries.
- **FSD role**: Contain global styles, providers, and initialization logic.

**Example Structure:**
```text
app/
├── _providers/       (FSD: Global providers)
├── _styles/          (FSD: Global CSS)
├── layout.tsx        (Next.js: Root layout)
├── page.tsx          (Next.js: Home route, imports from pages/home)
└── ...
```
*Note: Using an underscore prefix (like `_providers`) is a common way to indicate that a folder inside `app/` is not a route.*

## 3. Resolving the `pages/` Conflict

FSD has a `pages` layer, but Next.js also uses a `pages/` directory if the Pages Router is enabled.

- **If using App Router ONLY**: You can safely have a root `pages/` directory as an FSD layer because Next.js 16 prioritizes the `app/` directory for routing.
- **If using Pages Router**: Rename the FSD layer to `views/` or place it inside `shared/pages/` to avoid conflict with the root-level `pages/` directory that Next.js uses for routing.

## 4. Routing Best Practice

Next.js `page.tsx` files should be kept thin. They should simply import and render a component from the **FSD Pages Layer**.

### Example `app/products/[id]/page.tsx` (Next.js)
```tsx
import { ProductDetailsPage } from '@/pages/product-details';

export default function Page({ params }: { params: { id: string } }) {
  // Pass params to the FSD page component
  return <ProductDetailsPage id={params.id} />;
}
```

## 5. Summary of Folder Mapping

| FSD Layer | Next.js 16 Location | Recommendation |
| :--- | :--- | :--- |
| **App** | `app/` | Use for layouts and global providers. |
| **Pages** | `pages/` | Keep pure UI/Logic here; import into Next.js routes. |
| **Widgets** | `widgets/` | Standard FSD placement at root. |
| **Features** | `features/` | Standard FSD placement at root. |
| **Entities** | `entities/` | Standard FSD placement at root. |
| **Shared** | `shared/` | Standard FSD placement at root. |
