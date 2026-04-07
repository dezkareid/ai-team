# Future-proofing for SASS

While the project currently mandates Vanilla CSS, following a structured methodology ensures that migrating to SASS (or other preprocessors) in the future will be straightforward.

## 1. Organizing Files by Object/Component

Even in Vanilla CSS, you should organize your styles into separate files based on BEM blocks or OOCSS objects.

### Current Structure (Vanilla CSS)
```text
styles/
  base.css
  objects/
    button.css
    card.css
  components/
    search-form.css
    user-profile.css
  main.css  (imports everything)
```

### Migration Path (SASS)
Simply rename `.css` to `.scss` and use SASS `@use` or `@forward` instead of CSS `@import`.

## 2. Using CSS Variables for Tokens

Use CSS Custom Properties (Variables) for colors, fonts, and spacing. This maps directly to SASS variables.

### Vanilla CSS
```css
:root {
  --color-primary: #007bff;
  --spacing-md: 16px;
}

.button--primary {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
}
```

### SASS
```scss
$color-primary: #007bff;
$spacing-md: 16px;

.button--primary {
  background-color: $color-primary;
  padding: $spacing-md;
}
```

## 3. Anticipating Nesting

BEM naming convention is designed to be easily refactored into SASS nesting.

### Vanilla CSS (BEM)
```css
.card {}
.card__title {}
.card__body {}
.card--featured {}
```

### SASS (Nesting with `&`)
```scss
.card {
  &__title { }
  &__body { }
  
  &--featured { }
}
```

## 4. OOCSS Structure for Mixins

The OOCSS principle of separating "skin" from "structure" is a perfect candidate for SASS Mixins.

### SASS Mixin Example
```scss
@mixin button-structure {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
}

.button-primary {
  @include button-structure;
  background-color: blue;
}
```

## Summary for Migration

By following BEM and OOCSS in Vanilla CSS today:
1.  **Selectors stay flat**, preventing specificity wars that preprocessors can sometimes exacerbate.
2.  **Naming is consistent**, allowing automated or semi-automated conversion.
3.  **Modular structure** is already in place, making it easy to create a SASS partials system.
