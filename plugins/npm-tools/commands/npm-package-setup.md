---
description: "Initialize and publish a new npm package."
---

You are an expert at setting up npm packages. Your goal is to initialize a new package and publish it to npm.

Follow this workflow strictly:

### 1. Metadata Gathering
Identify the target directory, package name, version (default: 0.0.0), and description from the user's input: $ARGUMENTS. The package name must be in kebab-case and description must be in sentence case. Both must be provided by the user. If the user does not provide them, ask for them.

Then gather the following details automatically before asking the user anything:

1. **Working directory**: Use the target directory provided, or default to the current working directory.
2. **Repository URL**: Run `git remote get-url origin` in the working directory to detect the remote URL. Convert SSH URLs (e.g. `git@github.com:user/repo.git`) to HTTPS format (e.g. `https://github.com/user/repo`).
3. **Bugs URL**: Derive from the repository URL by appending `/issues` (e.g. `https://github.com/user/repo/issues`).
4. **Author name**: Run `git config user.name` to get the configured git author name.
5. **Author email**: Run `git config user.email` to get the configured git author email.
6. **License**: Default to `ISC` unless specified by the user.

If any of the above commands fail or return no output, omit those fields entirely from the generated files.

### 2. File Creation (Conditional)
Check if `package.json` or `README.md` already exist in the target directory. 
- If they exist, **DO NOT** overwrite them. 
- If they do not exist, create them with the following content (replacing placeholders):

**package.json content:**
```json
{
  "name": "[package-name]",
  "version": "[version]",
  "description": "[description]",
  "repository": {
    "type": "git",
    "url": "[repository-url]"
  },
  "author": "[author-name] <[author-email]>",
  "license": "[license]",
  "bugs": {
    "url": "[bugs-url]"
  },
  "publishConfig": {
    "access": "public"
  },
  "keywords": [
    "setup",
    "package",
    "npm"
  ]
}
```

**README.md content:**
```markdown
# [package-name]

[description]

## Installation

```bash
npm install [package-name]
```

## Usage

```javascript
// Add usage examples here
```

## License

ISC
```

### 3. Authentication and Publishing
Perform the following steps for publishing:
1. Check if the user is logged into npm by running `npm whoami`.
2. If NOT logged in:
   - Instruct the user to run `npm login`.
   - **WAIT** for the user to confirm they have successfully logged in before continuing.
3. Once the user is confirmed as logged in, navigate to the target directory and run `npm publish`.

## Post-Publishing
Tell the user the package has been published: "https://www.npmjs.com/package/[package-name]" and provide the link to configure trusted publishers: "https://www.npmjs.com/package/[package-name]/access".


User Input: $ARGUMENTS
