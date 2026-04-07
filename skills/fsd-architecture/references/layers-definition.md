# FSD Layers Definition

Feature-Sliced Design (FSD) organizes a project into 6 hierarchical layers. Each layer has a specific purpose and strict rules for communication with other layers.

## 1. App
The entry point of the application. It contains app-wide settings, global styles, and top-level providers.
- **Examples**: `Providers`, `GlobalStyles`, `Router configuration`, `App component`.
- **Dependencies**: Can depend on all lower layers.

## 2. Pages
Full pages of the application. They are responsible for fetching data for the page and composing widgets.
- **Examples**: `HomePage`, `ProductDetailsPage`, `ProfilePage`.
- **Dependencies**: Can depend on Widgets, Features, Entities, and Shared.

## 3. Widgets
Complex, self-contained UI components that combine features and entities to provide a complete piece of functionality.
- **Examples**: `Header`, `Sidebar`, `UserCardList`, `DashboardStats`.
- **Dependencies**: Can depend on Features, Entities, and Shared.

## 4. Features
User interactions and actions that provide business value. Features are usually small and focused on a single task.
- **Examples**: `AddToWishlist`, `LikePost`, `UpdateProfileForm`, `SearchByCatalog`.
- **Dependencies**: Can depend on Entities and Shared.

## 5. Entities
Business logic and data models. This layer represents the core business objects of the application.
- **Examples**: `User`, `Post`, `Comment`, `Order`.
- **Dependencies**: Can only depend on the Shared layer.

## 6. Shared
Reusable UI components, helpers, configuration, and API clients. This layer is highly decoupled and agnostic of business logic.
- **Examples**: `Button`, `Input`, `api-client`, `date-helpers`, `design-tokens`.
- **Dependencies**: Cannot depend on any other layer.

## Summary Table

| Layer | Purpose | Main Contents |
| :--- | :--- | :--- |
| **App** | Initialization | Providers, global styles, entry point |
| **Pages** | Composition | Page-level data fetching, composition of widgets |
| **Widgets** | Complex Blocks | Composition of features and entities |
| **Features** | User Actions | Interaction logic, mutations, forms |
| **Entities** | Business Logic | Domain models, data state, core logic |
| **Shared** | Utilities | Generic UI, helpers, config, constants |
