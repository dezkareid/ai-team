# HTML Attributes Extensibility

When building React components that render standard HTML elements, it's a best practice to make them extensible by including the native HTML attributes in their props definition. This allows users of your component to pass standard attributes (like `id`, `className`, `style`, `aria-*`, etc.) without you having to explicitly define each one.

## Using `React.HTMLAttributes`

For general elements like `div`, `span`, `section`, etc., use `React.HTMLAttributes<T>`.

### Example: A Container Component

```tsx
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'fluid' | 'fixed';
}

export const Container = ({ variant = 'fixed', className, ...props }: ContainerProps) => {
  const baseClass = variant === 'fluid' ? 'container-fluid' : 'container';
  return (
    <div 
      className={`${baseClass} ${className || ''}`} 
      {...props} 
    />
  );
};
```

## Specialized Attribute Types

For specific elements like `button`, `input`, or `anchor`, use their specialized attribute types to ensure proper typing for unique attributes (like `type` for buttons or `href` for anchors).

### Example: An Extensible Button

```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ size = 'md', className, ...props }: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${size} ${className || ''}`} 
      {...props} 
    />
  );
};
```

## Using `ComponentPropsWithoutRef` or `ComponentPropsWithRef`

React also provides `ComponentPropsWithoutRef<'element'>` which is often cleaner as it automatically maps the element string to its attribute type.

### Example: Using element strings

```tsx
import React, { ComponentPropsWithoutRef } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export const Input = ({ label, id, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
};
```

## Best Practices

1.  **Spread Props**: Always spread the remaining props (`...props`) onto the underlying HTML element.
2.  **Handle `className` and `style`**: Concatenate incoming `className` with your component's internal classes.
3.  **Direct Ref Prop (React 19+)**: When building reusable components, pass the `ref` directly as a prop so users can access the underlying DOM node. `forwardRef` is deprecated in React 19.

### Example: Direct Ref Prop

```tsx
import React, { ComponentPropsWithRef } from 'react';

export const CustomInput = ({ className, ref, ...props }: ComponentPropsWithRef<'input'>) => {
  return (
    <input
      ref={ref}
      className={`custom-input ${className || ''}`}
      {...props}
    />
  );
};
```
