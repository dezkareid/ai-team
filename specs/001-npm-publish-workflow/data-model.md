# Data Model: NPM Publication Workflow Command

## 1. Entities

### WorkflowConfiguration
Represents the parameters used to generate the GitHub Actions workflow.
- **`packageManager`**: `Enum` (`npm`, `pnpm`)
- **`isMonorepo`**: `Boolean`
- **`packagesYamlPath`**: `String` (Fixed: `.github/packages.yml`)
- **`provenanceEnabled`**: `Boolean` (Fixed: `true`)

### ReleaseTemplate
The shared configuration stored in `.github/releaserc-template.json`.
- **`plugins`**: `List<String>`
- **`extends`**: `String` (Optional, `semantic-release-monorepo` if `isMonorepo` is true)

### PackageMapping (Monorepo only)
The mapping defined in `.github/packages.yml`.
- **`packageName`**: `String`
- **`pathGlob`**: `String` (e.g., `./packages/my-pkg/**`)

### PackageMetadata
Information about the package(s) to be published.
- **`name`**: `String` (from `package.json`)
- **`packageNameWithoutScope`**: `String` (e.g., `my-pkg` from `@scope/my-pkg`)
- **`isPrivate`**: `Boolean` (from `package.json`)
- **`relativePath`**: `String` (Path from root, e.g., `packages/my-pkg`)

## 2. Relationships
- **`WorkflowConfiguration`** governs the generation of the **`WorkflowFile`** (`ci.yml` or `ci-packages.yml`).
- **`WorkflowConfiguration`** triggers the creation of the **`ReleaseTemplate`**.
- In monorepos, **`WorkflowConfiguration`** requires a **`PackageMapping`** to correctly build the matrix.

## 3. Validation Rules
- **V-001**: Root `package.json` MUST exist.
- **V-002**: `pnpm-workspace.yaml` presence MUST trigger monorepo mode.
- **V-003**: `private: true` in `package.json` MUST trigger a warning.
- **V-004**: `release` job MUST have `id-token: write` permission.
- **V-005**: `tag-format` MUST follow the convention: `${packageName}-v${version}` (monorepo) or `${packageNameWithoutScope}-v${version}` (single repo).

## 4. State Transitions
- **`Draft`**: Configuration being gathered from environment.
- **`Validated`**: Environment checked and configuration confirmed.
- **`Generated`**: Workflow YAML, release template, and (optional) mapping file written to disk.
- **`Informed`**: User provided with manual steps for Trusted Publisher setup on npmjs.com.
