# PEC ACM Website

The official website for PEC ACM.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Project Structure

```
src/
├── components/    # React components
├── data/          # Static data and constants
├── emails/        # React Email templates
├── hooks/         # Custom React hooks
├── lib/           # Internal packages and utilities
│   ├── api/       # API clients and queries
│   ├── assets/    # Static assets (images, fonts, icons)
│   ├── env/       # Environment configuration
│   ├── schemas/   # Zod validation schemas
│   ├── types/     # TypeScript type definitions
│   └── utils/     # Utility functions
├── routes/        # TanStack Start routes
└── styles/        # Sass stylesheets
```

## Tech Stack

- **Framework**: TanStack Start
- **Language**: TypeScript
- **Styling**: Sass (CSS Modules)
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Linting/Formatting**: Biome
- **Package Manager**: pnpm

## Scripts

```bash
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm start         # Preview production build
pnpm lint          # Run linter
pnpm format        # Format code
pnpm format:check  # Check formatting without writing
pnpm email:dev     # Start React Email dev server (port 2999)
pnpm check         # Run all checks (format + lint)
```

## Development

### Path Aliases

- `$components` → `src/components`
- `$data` → `src/data`
- `$env` → `src/lib/env`
- `$emails` → `src/emails`
- `$hooks` → `src/hooks`
- `$lib` → `src/lib`
- `$assets` → `src/lib/assets`
- `$styles` → `src/styles`

### Code Style

This project uses Biome for formatting and linting. Pre-commit hooks are configured with Husky.

Read the full style guide: [CODE_STYLE.md](./CODE_STYLE.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

See [LICENSE](./LICENSE) for license information.
