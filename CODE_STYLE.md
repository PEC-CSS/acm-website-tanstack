# PEC ACM Website Code Style and Formatting

The PEC ACM Website codebase mainly uses [Oxfmt](ihttps://oxc.rs/docs/guide/usage/formatter.html) for code formatting in order to quickly and automatically check for formatting (and sometimes logical) errors in code.

The Project includes pnpm scripts for linting and formatting, in addition to pre-commit hooks with [husky](https://typicode.github.io/husky/). These scripts include:

```bash
pnpm run fmt # Run the formatter on the project and write any changes to the filesystem, if applicable
pnpm run fmt:check # Run the formatter on the project but don't write any changes to the filesystem
pnpm run lint # Run various checks on the project
pnpm run lint:fix # Run various checks on the project and try auto-fixing them
pnpm run check # Runs formatter, linter and import sorting on the project but don't write any changes to the filesystem
pnpm run check # Runs formatter, linter and import sorting on the project and write any changes to the filesystem, if applicable
```

The guiding principles of the code style and code formatting can be summarized as:

- no nonsense
- use your own judgement
- break the rules **if it makes sense** e.g.: it improves readability substantially
- use the formatting of the file you're in, even if it breaks the rules
- no nonsense

It's worth noting that modern IDEs and text editors can run Oxlint automatically on save. It may be worth looking into whether this functionality is supported in your editor for a more convenient development workflow.

## Table of Contents

- [Path Aliases](#path-aliases)
- [Formatting](#formatting)
- [Naming Conventions](#naming-conventions)
  - [Files](#files)
  - [Code](#code)
- [Import Sorting](#import-sorting)
  - [Import Categories](#import-categories)
  - [Complex Example](#complex-example)
  - [Route/Page Example](#routepage-example)
  - [Notes on Import Sorting](#notes-on-import-sorting)
  - [Common Patterns](#common-patterns)
- [React Conventions](#react-conventions)
  - [Component Props](#component-props)
  - [Extending HTML Element Props](#extending-html-element-props)
- [TypeScript Guidelines](#typescript-guidelines)

## Path Aliases

The following path aliases are configured to improve import statements and maintain clarity across the codebase:

- **$components**: Points to the `src/components` directory.
- **$data**: Points to the `src/data` directory.
- **$env**: Points to the `src/lib/env` directory.
- **$emails**: Points to the `src/emails` directory and contains React Email templates.
- **$hooks**: Points to the `src/hooks` directory.
- **$lib**: Points to the `src/lib` directory and is the place for creating internal packages.
- **$assets**: Points to the `src/lib/assets` directory and contains all the static assets used in the project.
- **$styles**: Points to the `src/styles` directory and contains all Sass stylesheets.

## Formatting

- Oxlint is enabled for formatting with the following settings:
  - **Indentation Style**: Spaces
  - **Indent Width**: 2 spaces
  - **Attribute Position**: Multiline
  - **Quote Style**: Double quotes
  - **Arrow Parentheses**: Add parentheses only as needed.

## Naming Conventions

### Files

- All file names must be in **lowercase kebab case** (e.g., `src/components/sidebar/index.tsx`).
- Directories should follow the same kebab case convention.

### Code

- **Type Names** and **Zod Schemas** should use **Pascal Case** (e.g., `Sidebar`, `UserSchema`).
- **Constant Values** should be in **UPPER_SNAKE_CASE** (e.g., `BACKEND_BASE_URL`, `MAX_RETRY_COUNT`).
- **Functions** and **Variables** should be in **camelCase** (e.g., `handleClick`, `userData`).
- Use meaningful names that clearly describe the purpose of the variables, functions, and types.

## Import Sorting

### Import Categories

Imports must be sorted into the following categories:

- **Types**: All type imports at the top.
- **External Packages**:
  - Imports starting with a symbol come first.
  - Followed by named imports.
- **Assets**: Static files like images, fonts, icons.
- **Components**: Imported from `$components` path alias.
- **Data**: Imported from `$data` path alias.
- **Hooks**: Imported from `$hooks` path alias.
- **Internal Packages**:
  - All internal imports are created inside `src/lib/` directory and can be imported using the `$lib` path alias.
- **Styles**: Sass/SCSS files imported from `$styles` path alias.

**Rules:**

- Each category must be separated by a single line to enhance readability.
- Within each category, sort imports alphabetically when possible.

### Complex Example

```tsx
// Types
import type { FC, ReactNode } from "react";
import type { ApiResponse } from "$lib/types/api";
import type { User, UserRole } from "$lib/types/user";

// External Packages
import { treaty } from "@elysiajs/eden";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

// Assets
import DEFAULT_AVATAR from "$assets/images/default-avatar.png";

// Components
import Avatar from "$components/avatar";
import Button from "$components/button";
import Modal from "$components/modal";
import Spinner from "$components/spinner";

// Data
import { USER_DEFAULTS } from "$data/constants";
import { ROLE_PERMISSIONS } from "$data/permissions";

// Hooks
import { useAuth } from "$hooks/use-auth";
import { useDebounce } from "$hooks/use-debounce";
import { useLocalStorage } from "$hooks/use-local-storage";

// Internal Packages
import { api } from "$lib/api";
import { UserSchema } from "$lib/schemas/user";
import { formatDate, truncate } from "$lib/utils";

// Styles
import styles from "$styles/components/user-profile.module.scss";
```

### Route/Page Example

```tsx
// Types
import type { EventData, EventFilters } from "$lib/types/events";

// External Packages
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

// Assets
import HERO_IMAGE from "$assets/images/events-hero.jpg";

// Components
import EventCard from "$components/event-card";
import FilterBar from "$components/filter-bar";
import Pagination from "$components/pagination";

// Data
import { EVENT_CATEGORIES } from "$data/categories";

// Hooks
import { useFilters } from "$hooks/use-filters";

// Internal Packages
import { eventsQueryOptions } from "$lib/api/events";
import { filterEvents, sortEvents } from "$lib/utils/events";

// Styles
import styles from "$styles/pages/events.module.scss";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQueryOptions()),
});

function EventsPage() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions());
  // ... component logic
}
```

### Notes on Import Sorting

- **React imports**: Place React-specific imports (`useState`, `useEffect`, etc.) in the External Packages section
- **TanStack imports**: Place `@tanstack/react-router`, `@tanstack/react-query`, and `@tanstack/start` in External Packages
- **Route exports**: `createFileRoute` and `createAPIFileRoute` should be imported early in External Packages
- **Server functions**: `createServerFn` belongs in External Packages
- **Sass imports**:
  - Component styles: `$styles/components/component-name.module.scss`
  - Page styles: `$styles/pages/page-name.module.scss`
  - Global styles: `$styles/globals.scss` or `$styles/variables.scss`
  - Use CSS Modules (`.module.scss`) for component-scoped styles
- **Assets**: Static files like images, fonts, icons should come early (after External Packages) since they're often used in JSX, and should be named like constants.
- **Relative imports**: Avoid when possible; use path aliases instead
- **Side-effect imports**: Place at the very top if absolutely necessary (e.g., `import './polyfills'`)

### Common Patterns

```tsx
// Good - Clear categories with separation
import type { Props } from "$lib/types";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import ICON from "$assets/icons/star.svg";

import Button from "$components/button";

import { api } from "$lib/api";

import styles from "$styles/components/card.module.scss";

// Good - Multiple imports from same source on one line
import { useCallback, useEffect, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

// Good - Destructured imports alphabetically
import { api, auth, cache } from "$lib/api";

// Avoid - Mixed categories without separation
import Button from "$components/button";
import styles from "$styles/app.module.scss";
import { useState } from "react";
import type { Props } from "./types";
import icon from "$assets/icon.svg";
```

## React Conventions

- Prefer functional components with hooks
- Use named exports for components
- Avoid default exports except for route components

### Component Props

- **Always** define an explicit props interface, even if empty
- Props interfaces should be named `ComponentNameProps`
- Place the interface directly above the component definition
- Use `interface` (not `type`) for props to allow future extension

#### Examples

```tsx
// Good - Explicit empty interface
interface HeaderProps {}

export function Header(props: HeaderProps) {
  return <header>PEC ACM</header>;
}

// Good - With props
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function Button({ variant = "primary", onClick }: ButtonProps) {
  return <button onClick={onClick}>{variant}</button>;
}

// Avoid - No explicit props type
export function Footer({ children }) {
  return <footer>{children}</footer>;
}
```

### Extending HTML Element Props

When creating wrapper components, extend the appropriate HTML attributes:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  customProp?: string;
}
```

## TypeScript Guidelines

- Prefer `interface` for object shapes that may be extended
- Prefer `type` for unions, intersections, and primitives
- Avoid `any`; use `unknown` when type is truly unknown
- Generic type parameters: single capital letter (`T`, `K`, `V`) or descriptive PascalCase (`TUser`, `TResponse`)

### Examples

```tsx
// Good - Interface for extendable objects
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

// Good - Type for unions and primitives
type Status = "pending" | "active" | "inactive";
type ID = string | number;

// Good - Generic with descriptive name
function fetchData<TResponse>(url: string): Promise<TResponse> {
  // ...
}

// Avoid - Using 'any'
function process(data: any) {
  // ...
}

// Good - Using 'unknown' instead
function process(data: unknown) {
  if (typeof data === "string") {
    // ...
  }
}
```
