# OOCSS Organization

OOCSS (Object-Oriented CSS) is a methodology that encourages code reuse and maintainability by treating CSS as a collection of "objects". Two of its most important principles are the separation of structure from skin and the separation of container from content.

## 1. Separate Structure from Skin

This principle suggests that you should define the layout and structural properties of an element separately from its visual appearance (the "skin").

- **Structure**: Properties like `width`, `height`, `margin`, `padding`, `display`, `overflow`.
- **Skin**: Properties like `color`, `background-color`, `border`, `box-shadow`, `font-family`.

### Example: A Button Component

Instead of creating multiple specific button classes, you create a base structural class and multiple skin classes.

```css
/* Structural Base (Structure) */
.button {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
}

/* Skin Variants (Skin) */
.button--primary {
  background-color: #007bff;
  color: white;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
}

.button--outline {
  background-color: transparent;
  border-color: #007bff;
  color: #007bff;
}
```

**Usage:**
```html
<button class="button button--primary">Primary Action</button>
<button class="button button--outline">Secondary Action</button>
```

## 2. Separate Container from Content

This principle suggests that an object should look the same no matter where you put it. You should avoid location-dependent styles.

### Incorrect (Location-dependent)
```css
/* This heading only looks this way inside the sidebar */
.sidebar h2 {
  font-size: 12px;
  color: gray;
}
```

### Correct (OOCSS)
```css
/* Define the object independently */
.widget__title {
  font-size: 12px;
  color: gray;
}

/* Use it anywhere */
<div class="sidebar">
  <h2 class="widget__title">Sidebar Title</h2>
</div>

<div class="footer">
  <h2 class="widget__title">Footer Title</h2>
</div>
```

## Benefits of OOCSS

1.  **Reduced CSS Size**: By reusing structural and skin patterns, you write significantly less CSS.
2.  **Scalability**: Adding new components or variants is faster because you can combine existing classes.
3.  **Maintainability**: Changes to a structural base or a global skin are propagated everywhere they are used.
4.  **Consistency**: Ensures that common UI elements (like shadows or borders) remain consistent across the application.

## Best Practices

1.  **Avoid IDs for styling**: Use classes to ensure reusability.
2.  **Avoid deeply nested selectors**: Stick to single class selectors whenever possible.
3.  **Use Utility Classes**: For one-off structural needs (like `margin-top: 10px`), consider using a utility system alongside OOCSS.
