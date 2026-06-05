# WebGG

A website hosting multiple [Babylon.js](https://www.babylonjs.com/) games and experiments, built with [SvelteKit](https://svelte.dev/docs/kit).

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) — full-stack web framework
- [Babylon.js](https://www.babylonjs.com/) — 3D game engine
- [Bun](https://bun.sh/) — package manager and runtime
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)

## Games

| Game          | Route                          | Description                                                         |
| ------------- | ------------------------------ | ------------------------------------------------------------------- |
| Hello Babylon | [`/hello`](./src/routes/hello) | Basic Babylon.js playground with a spinning sphere and ground plane |

## Getting Started

Install dependencies:

```sh
bun install
```

Start the dev server:

```sh
bun run dev
```

## Scripts

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `bun run dev`     | Start the Vite dev server    |
| `bun run build`   | Build for production         |
| `bun run preview` | Preview the production build |
| `bun run check`   | Run Svelte type-checking     |
| `bun run lint`    | Run Prettier and ESLint      |
| `bun run format`  | Auto-format with Prettier    |

## Project Structure

```
src/
├── lib/          # Shared code, utilities, assets
└── routes/       # SvelteKit routes (file-based routing)
    ├── +page.svelte          # Homepage — game gallery
    ├── +layout.svelte        # Root layout
    └── hello/
        └── +page.svelte      # Hello Babylon game
```

## Adding a New Game

1. Create a new route folder under `src/routes/` (e.g., `src/routes/my-game/`)
2. Add a `+page.svelte` with your Babylon.js scene
3. Register the game in `src/routes/+page.svelte` by adding to the `games` array

## License

Private
