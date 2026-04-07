# Next.js Integration with FSD

Integrating Feature-Sliced Design (FSD) with Next.js requires careful planning to avoid naming conflicts between FSD layers and Next.js reserved file-system routing folders (like `app/`, `pages/`, or `api/`).

## 1. Using the `src/` Directory

The most effective way to avoid conflicts is to place all FSD layers inside a `src/` directory. This isolates your architectural layers from the configuration files in the root.

```text
root/
├── public/
├── src/
│   ├── app/          (FSD Layer + Next.js App Router)
│   ├── pages/        (FSD Layer)
│   ├── widgets/      (FSD Layer)
│   ├── features/     (FSD Layer)
│   ├── entities/     (FSD Layer)
│   └── shared/       (FSD Layer)
├── next.config.js
└── package.json
```

## 2. Resolving the `app/` Conflict

Next.js App Router uses an `app/` directory for routing. FSD also has an `app` layer for global initialization.

### The Hybrid Approach
In Next.js, the `src/app/` directory serves both as the **FSD App Layer** and the **Next.js Routing Entry Point**.

- **Next.js role**: Define `layout.tsx`, `page.tsx`, and error boundaries.
- **FSD role**: Contain global styles, providers, and initialization logic.

**Example Structure:**
```text
src/app/
├── _providers/       (FSD: Global providers)
├── _styles/          (FSD: Global CSS)
├── layout.tsx        (Next.js: Root layout)
├── page.tsx          (Next.js: Home route, imports from src/pages/home)
└── ...
```
*Note: Using an underscore prefix (like `_providers`) is a common way to indicate that a folder inside `app/` is not a route.*

## 3. Resolving the `pages/` Conflict

FSD has a `pages` layer, but Next.js (Pages Router) also uses a `pages/` directory.

- **If using App Router**: You can safely have a `src/pages/` directory as an FSD layer because Next.js only looks at `src/app/` for routing.
- **If using Pages Router**: Use `src/shared/pages/` or rename the FSD layer to `views/` to avoid conflict with the root-level or `src/pages/` directory that Next.js uses for routing.

## 4. Routing Best Practice

Next.js `page.tsx` files should be kept thin. They should simply import and render a component from the **FSD Pages Layer**.

### Example `src/app/products/[id]/page.tsx` (Next.js)
```tsx
import { ProductDetailsPage } from '@/pages/product-details';

export default function Page({ params }: { params: { id: string } }) {
  // Pass params to the FSD page component
  return <ProductDetailsPage id={params.id} />;
}
```

## 5. Summary of Folder Mapping

| FSD Layer | Next.js Location | Recommendation |
| :--- | :--- | :--- |
| **App** | `src/app/` | Use for layouts and global providers. |
| **Pages** | `src/pages/` | Keep pure UI/Logic here; import into Next.js routes. |
| **Widgets** | `src/widgets/` | Standard FSD placement. |
| **Features** | `src/features/` | Standard FSD placement. |
| **Entities** | `src/entities/` | Standard FSD placement. |
| **Shared** | `src/shared/` | Standard FSD placement. |
