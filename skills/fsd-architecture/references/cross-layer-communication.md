# Cross-layer Communication in FSD

The most critical rule in Feature-Sliced Design (FSD) is **unidirectional dependency flow**. A layer can only import from layers that are strictly below it in the hierarchy.

## 1. Dependency Hierarchy

Imports must always go from top to bottom:
`App` → `Pages` → `Widgets` → `Features` → `Entities` → `Shared`

### Correct Import (Top-down)
A **Widget** importing from **Features**:
```tsx
// src/widgets/product-card/ui/ProductCard.tsx
import { AddToCartButton } from '@/features/add-to-cart';
import { ProductPrice } from '@/entities/product';
```

### Incorrect Import (Bottom-up or Circular)
A **Feature** importing from a **Widget**:
```tsx
// src/features/add-to-cart/ui/AddToCartButton.tsx
import { Header } from '@/widgets/header'; // ❌ ERROR: Bottom-up dependency
```

## 2. Slice Isolation

Slices within the same layer should **never** import from each other. If two slices need to share logic, that logic should be moved to a lower layer.

### Incorrect (Cross-slice)
```tsx
// src/features/auth/model/logout.ts
import { resetCart } from '@/features/cart'; // ❌ ERROR: Cross-slice dependency
```

### Correct (Move to lower layer)
Move the shared logic to an **Entity** or a **Shared** helper that both features can import.

## 3. The Public API (index.ts)

Every slice must have a public API that acts as a gatekeeper. Other layers should only import from this `index.ts`.

### Slice Structure
```text
src/features/add-to-cart/
├── ui/
│   ├── Button.tsx
│   └── Icon.tsx
├── model/
│   └── actions.ts
└── index.ts (Public API)
```

### public-api/index.ts
```tsx
export { Button as AddToCartButton } from './ui/Button';
export { useAddToCart } from './model/actions';
```

### Importing from Public API
```tsx
// ✅ Correct
import { AddToCartButton } from '@/features/add-to-cart';

// ❌ Incorrect (deep import)
import { Button } from '@/features/add-to-cart/ui/Button';
```

## 4. Communication Patterns

### Props Composition (Recommended)
Pass components from higher layers as props to lower layers to avoid bottom-up imports.

```tsx
// src/entities/user/ui/UserCard.tsx (Entity)
export const UserCard = ({ actionSlot }: { actionSlot: ReactNode }) => (
  <div className="user-card">
    <UserInfo />
    {actionSlot} {/* higher layer feature injected here */}
  </div>
);

// src/widgets/user-list/ui/UserList.tsx (Widget)
import { UserCard } from '@/entities/user';
import { FollowUserButton } from '@/features/follow-user';

export const UserList = ({ users }) => (
  <div>
    {users.map(u => (
      <UserCard key={u.id} actionSlot={<FollowUserButton userId={u.id} />} />
    ))}
  </div>
);
```

## Summary of Rules

1.  **Never import upwards**.
2.  **Never import from siblings in the same layer**.
3.  **Always import through the Public API** (`index.ts`).
4.  **Use composition** to inject higher-layer functionality into lower layers.
