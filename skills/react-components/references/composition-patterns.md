# React Composition Patterns

Composition is a powerful pattern in React that allows you to build complex UIs from smaller, independent building blocks. It is often preferred over inheritance.

## 1. Children-based Composition

The most common pattern is using the `children` prop to pass elements directly to another component.

### Example: A Generic Card

```tsx
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return (
    <div className="card">
      {children}
    </div>
  );
};

// Usage
const UserCard = () => (
  <Card>
    <h2>User Profile</h2>
    <p>Details about the user go here.</p>
  </Card>
);
```

## 2. Slots Pattern

Sometimes a component needs to render elements in specific "slots" (e.g., a header, a body, and a footer).

### Example: A Modal with Slots

```tsx
import React, { ReactNode } from 'react';

interface ModalProps {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ header, body, footer }: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal-header">{header}</div>
      <div className="modal-body">{body}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  );
};

// Usage
const MyModal = () => (
  <Modal
    header={<h1>Title</h1>}
    body={<p>Some content</p>}
    footer={<button>Close</button>}
  />
);
```

## 3. Render Props Pattern

Render props allow you to share stateful logic between components by passing a function as a prop.

### Example: Mouse Tracker

```tsx
import React, { useState, ReactNode } from 'react';

interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => ReactNode;
}

export const MouseTracker = ({ render }: MouseTrackerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {render(position)}
    </div>
  );
};

// Usage
const App = () => (
  <MouseTracker 
    render={({ x, y }) => (
      <h1>The mouse position is ({x}, {y})</h1>
    )}
  />
);
```

## 4. Compound Components

Compound components allow multiple components to work together by sharing state implicitly (usually via Context).

### Example: Tabs

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (id: string) => void;
} | null>(null);

export const Tabs = ({ children, defaultTab }: { children: ReactNode; defaultTab: string }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.Trigger = ({ id, label }: { id: string; label: string }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Trigger must be used within Tabs');
  return (
    <button onClick={() => context.setActiveTab(id)}>
      {label}
    </button>
  );
};

Tabs.Content = ({ id, children }: { id: string; children: ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Content must be used within Tabs');
  return context.activeTab === id ? <div>{children}</div> : null;
};

// Usage
const TabbedApp = () => (
  <Tabs defaultTab="one">
    <Tabs.Trigger id="one" label="Tab One" />
    <Tabs.Trigger id="two" label="Tab Two" />
    <Tabs.Content id="one">Content for One</Tabs.Content>
    <Tabs.Content id="two">Content for Two</Tabs.Content>
  </Tabs>
);
```

## Best Practices

1.  **Prefer Composition**: Start with simple children-based composition before reaching for more complex patterns.
2.  **Avoid Prop Drilling**: Use Context or Composition to avoid passing props through many layers.
3.  **Encapsulation**: Components should hide their internal logic but remain flexible for users through props and slots.
