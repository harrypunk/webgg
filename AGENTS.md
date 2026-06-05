# Agent Instructions

This file contains rules and conventions for AI agents working on this project.

## Package Manager

- **This is a Bun project.** Use `bun` for all package management tasks.
- Do **not** run `npm`, `npx`, `pnpm`, or `yarn` commands.
- Install dependencies: `bun add <pkg>`
- Install dev dependencies: `bun add -d <pkg>`
- Run scripts: `bun run <script>` (e.g., `bun run dev`, `bun run build`)

## Dev Server

- If the dev server is not running, **ask the user to run it** (`bun run dev`).
- Do **not** launch the dev server as a background task automatically.

## Code Quality

- Follow **SOLID principles** and keep code clean, readable, and maintainable.
- Prefer small, focused functions and components with single responsibilities.
- Avoid duplication (DRY) and unnecessary complexity.

## Linting & Formatting

- **ESLint** and **Prettier** are installed and configured.
- Always check lint output before considering work complete.
- Run `bun run lint` to check for issues.
- Run `bun run format` to auto-fix formatting.
- Fix all lint errors and warnings introduced by your changes.

## Git

- **Do not commit changes without explicit user permission.**
- Stage or prepare changes as needed, but ask before running `git commit`.
