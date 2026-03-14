# PEC ACM Website

The official website for PEC ACM.

## Quick Start

```bash
# Install dependencies
pnpm install

<<<<<<< vidhi/backendstuff
Or

``bash
pnpm install
pnpm dev
``

# Building For Production
=======
# Start development server
pnpm dev
>>>>>>> main

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
│   ├── api/       # Elysia route handlers and utilities
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
- **Styling**: Tailwind CSS
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Linting/Formatting**: Oxc (Oxlint and Oxfmt)
- **Package Manager**: pnpm

## Scripts

```bash
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm start         # Preview production build
pnpm lint          # Run linter without writing
pnpm lint:fix      # Run linter
pnpm fmt           # Format code
pnpm fmt:check     # Check formatting without writing
pnpm email:dev     # Start React Email dev server (port 2999)
pnpm check         # Run all checks (format + lint)
```

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for development guide.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

See [LICENSE](./LICENSE) for license information.
