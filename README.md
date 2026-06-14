# WebGG

A website hosting multiple [Babylon.js](https://www.babylonjs.com/) games and experiments, built with [SvelteKit](https://svelte.dev/docs/kit).

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) — full-stack web framework
- [Babylon.js](https://www.babylonjs.com/) — 3D game engine
- [Bun](https://bun.sh/) — package manager and runtime
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)

## Games

| Game          | Route                                | Description                                        |
| ------------- | ------------------------------------ | -------------------------------------------------- |
| Hello Babylon | [`/hello`](./src/routes/hello)       | Basic Babylon.js playground with a spinning sphere |
| Ping Pong     | [`/pingpong`](./src/routes/pingpong) | Classic paddle game with lighting and shadows      |

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
├── lib/
│   ├── babylon/
│   │   ├── BabylonCanvas.svelte      # Reusable canvas/engine/scene component
│   │   ├── canvasSize.ts             # Portrait / Landscape presets
│   │   └── ship.ts                   # Shared ship mesh factory
│   └── assets/
└── routes/
    ├── +page.svelte                  # Homepage — game gallery
    ├── +layout.svelte                # Root layout
    ├── hello/
    │   └── +page.svelte              # Hello Babylon game
    └── pingpong/                     # Ping Pong game
        ├── +page.svelte              # Page + component assembly
        ├── Canvas.svelte             # Engine + reactive canvas sizing
        ├── Scene.svelte              # Scene context + render loop
        ├── Camera.svelte             # TargetCamera setup
        ├── HemisphereLight.svelte    # Ambient lighting
        ├── DirectionalLight.svelte   # Directional light setup
        ├── ShadowGenerator.svelte    # Shadow generator setup
        ├── Ground.svelte             # Ground mesh
        ├── Paddle.svelte             # Paddle mesh + movement
        └── context.ts                # Engine/Scene contexts
```

## Architecture

The Ping Pong route follows a **declarative Svelte-Babylon component hierarchy**:

```
Canvas
└── Scene
    ├── Camera
    ├── HemisphereLight
    ├── DirectionalLight
    ├── ShadowGenerator
    ├── Ground
    └── Paddle
```

- `Canvas` creates the engine and reactive canvas sizing
- `Scene` creates the scene and provides it via context
- Each Babylon object is a focused Svelte component
- Shared sibling state (e.g. light, shadow generator) is lifted to the parent page and passed through props / bindings

Contexts are limited to `EngineContext` and `SceneContext`. Everything else is passed explicitly for clean interfaces.

## Adding a New Game

1. Create a new route folder under `src/routes/` (e.g., `src/routes/my-game/`)
2. Add a `+page.svelte` with your Babylon.js scene
3. Put shared game logic under `src/lib/babylon/my-game/`
4. Register the game in `src/routes/+page.svelte` by adding to the `games` array

## License

Private
