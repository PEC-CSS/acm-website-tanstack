# Development guide

The project uses [pnpm](https://pnpm.io/) for package management and scripts. Make sure to install it before getting your hands dirty with the code.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Getting Started](#getting-started)
- [Path Aliases](#path-aliases)
- [Code Style](#code-style)

## Prerequisites

- `pnpm` - >v9.0.0
- `node` - >v20.0.0
- `docker` - >v27.0.0

## Environment Variables

The Project requires the following set of Environmental variables for running in development environment.
Database related variables can be omitted for the production environment (as the backend lives on a different service).

|    Variable Name    |                What It Does?                 |           Example            |
| :-----------------: | :------------------------------------------: | :--------------------------: |
| `BACKEND_BASE_URL`  |       URL where the backend is running       |   `http://localhost:8080`    |
|     `SMTP_HOST`     | Host URL for connection to the E-Mail Server |    `smtp.ethereal.email`     |
|     `SMTP_PORT`     |   Port for connection to the E-Mail Server   |             587              |
|    `SMTP_EMAIL`     |        E-mail used for E-Mail Server         | `dummy.email@acm-pec.edu.in` |
|     `SMTP_PASS`     |          Password for E-Mail Server          |   `AReally$tr0ngPa55w0rd`    |
|    `POSTGRES_DB`    |   Database name for the Postgres Database    |            `acm`             |
|   `POSTGRES_USER`   |      Username for the Postgres Database      |          `acmsecy`           |
| `POSTGRES_PASSWORD` |      Password for the Postgres Database      |          `acmhead`           |

## Available Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start development server               |
| `pnpm build`        | Build for production                   |
| `pnpm serve`        | Preview production build               |
| `pnpm format`       | Run formatter                          |
| `pnpm format:write` | Run formatter and fix issues           |
| `pnpm lint`         | Run linting checks                     |
| `pnpm check`        | Run all checks (format, lint, imports) |
| `pnpm check:write`  | Run checks and fix issues              |

## Getting Started

1. Set Environment Variables
   - Copy the example `.env` file and update it with your values (see the [Environment Variables](#environment-variables) table above for details)

```sh
cp .env.example .env
```

> [!WARNING]
> Never commit your `.env` file to version control. Verify it's listed in `.gitignore`.

> [!TIP]
> If you want to test routes that use the email server, You can use [ethereal.email](https://ethereal.email/) to generate SMTP credentials.

2. Spin up a container with the postgres server and backend server using the compose file `docker-compose.yml`.

```sh
docker compose up -d
```

> [!IMPORTANT]
> Make sure to use the `-v` flag when destroying the container to remove volumes.
>
> ```sh
> docker compose down -v
> ```

3. Verify Services Are Running
   - Backend: `http://localhost:8080`
   - PostgreSQL: `localhost:5432`

   The database is pre-seeded with test data. Use these credentials:
   - Email: `harshpreetsinghjohar.btcse20@pec.edu.in`
   - Password: `admin123`

Check Docker logs if services fail to start:

```sh
docker compose logs
```

4. Install Dependencies

```sh
pnpm install
```

5. Run Dev Server

- The frontend dev server should now be running on port `3000`

```sh
pnpm dev
```

## Path Aliases

The project includes path aliases for commonly used internal packages/libraries which _should_ be used to avoid long import paths in the code. These are configured in the project typescript config `tsconfig.json`.

- `$components` → `src/components`
- `$data` → `src/data`
- `$env` → `src/lib/env`
- `$emails` → `src/emails`
- `$hooks` → `src/hooks`
- `$lib` → `src/lib`
- `$assets` → `src/lib/assets`
- `$styles` → `src/styles`

## Code Style

This project uses Biome for formatting and linting. Pre-commit hooks are configured with Husky.
You can install Biome's Extension for your code editor to show you linting hints and help you with formatting the files on save.

See the [Available Scripts](#available-scripts) section for formatting and linting commands.

Husky runs the `check` script on the staged files with the flag `--no-errors-on-unmatched` on the `pre-commit` event.

Read the full style guide: [CODE_STYLE.md](./CODE_STYLE.md)
