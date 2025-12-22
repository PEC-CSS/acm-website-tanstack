# PEC ACM Website Code Style and Formatting

The PEC ACM Website codebase mainly uses [Biome](https://biomejs.dev/) for code formatting in order to quickly and automatically check for formatting (and sometimes logical) errors in code.
The Project include pnpm scripts for linting and formatting, in addition to pre-commit hooks with [husky](https://typicode.github.io/husky/). These scripts include:

```bash
pnpm run format # Run the formatter on the project and write any changes to the filesystem, if applicable
pnpm run format:check # Run the formatter on the project but don't write any changes to the filesystem
pnpm run lint # Run various checks on the project
pnpm run check # Runs formatter, linter and import sorting on the project
```

The guiding principles of the filament code style and code formatting can be resumed as:
- no nonsense
- use your own judgement
- break the rules **if it makes sense** e.g.: it improves readability substantially
- use the formatting of the file you're in, even if it breaks the rules
- no nonsense

It's worth noting that modern IDEs and text editors can run Biome automatically on save. It may be worth looking into whether this functionality is supported in your editor for a more convenient development workflow.

## Table of Contents
- [Formatting](#formatting)
- [Naming Conventions](#naming-conventions)
  - [Files](#files)
  - [Code](#code)


## Formatting

## Naming Conventions

### Files

### Code

