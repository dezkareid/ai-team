# BEM Naming Convention

BEM (Block, Element, Modifier) is a popular naming convention for classes in HTML and CSS. It helps you to create reusable components and code sharing in front-end development.

## The Structure

The naming convention follows this pattern:
`.block__element--modifier`

### 1. Block
Standalone entity that is meaningful on its own.
Examples: `header`, `container`, `menu`, `checkbox`, `input`.

### 2. Element
A part of a block that has no standalone meaning and is semantically tied to its block.
Examples: `menu item`, `list item`, `checkbox caption`, `header title`.
Notation: Two underscores `__`.

### 3. Modifier
A flag on a block or element. Use them to change appearance or behavior.
Examples: `disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`.
Notation: Two hyphens `--`.

## Code Example

### HTML

```html
<!-- Block -->
<form class="search-form">
  <!-- Element -->
  <input class="search-form__input" type="text" placeholder="Search...">
  
  <!-- Element with Modifier -->
  <button class="search-form__button search-form__button--primary" type="submit">
    Search
  </button>
  
  <!-- Modifier on Block -->
  <div class="search-form search-form--advanced">
     <!-- ... -->
  </div>
</form>
```

### CSS

```css
/* Block style */
.search-form {
  display: flex;
  gap: 10px;
}

/* Element style */
.search-form__input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Element style */
.search-form__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Modifier style */
.search-form__button--primary {
  background-color: blue;
  color: white;
}

/* Modifier on Block */
.search-form--advanced {
  flex-direction: column;
}
```

## Benefits of BEM

1.  **Modularity**: Block styles are never dependent on other elements on a page, so you never experience cascading issues.
2.  **Reusability**: Composing independent blocks in different ways and reusing them across projects reduces the amount of CSS code.
3.  **Structure**: BEM gives your CSS code a solid structure that remains easy to understand and maintain.

## Common Mistakes to Avoid

- **Nesting elements**: `.block__elem1__elem2` is invalid. Stick to `.block__elem2`.
- **Using BEM for everything**: Don't use it for global utilities (like `.u-text-center`) if you have a separate utility system.
- **Over-modifying**: If a block changes completely, it might be a new block instead of a modifier.
