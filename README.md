# WebGG

A website hosting multiple [Babylon.js](https://www.babylonjs.com/) games and experiments, built with [SvelteKit](https://svelte.dev/docs/kit).

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) — full-stack web framework
- [Babylon.js](https://www.babylonjs.com/) — 3D game engine
- [Bun](https://bun.sh/) — package manager and runtime
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)

## Games

| Game           | Route                                              | Description                                                         |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Hello Babylon  | [`/hello`](./src/routes/hello)                     | Basic Babylon.js playground with a spinning sphere                  |
| Ping Pong      | [`/pingpong`](./src/routes/pingpong)               | Simple paddle scene with a white paddle, grey floor, and debug mode |
| Scene Switcher | [`/example/switch1`](./src/routes/example/switch1) | Cycle through cube, sphere, and cone scenes                         |

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
│   ├── attachments/
│   │   └── fullscreen.svelte.ts      # Fullscreen runes store
│   ├── babylon/
│   │   ├── Canvas.svelte             # Shared engine + reactive canvas sizing
│   │   ├── Scene.svelte              # Shared scene context + render loop
│   │   └── context.ts                # EngineContext + SceneContext
│   ├── components/
│   │   ├── FullscreenButton.svelte   # Fullscreen toggle button
│   │   └── FullscreenIcon.svelte     # Corner fullscreen icon
│   ├── styles/
│   │   └── app.css                   # Shared page chrome styles
│   └── assets/
└── routes/
    ├── +page.svelte                  # Homepage — game gallery
    ├── +layout.svelte                # Root layout
    ├── hello/
    │   ├── +page.svelte              # Hello Babylon page
    │   └── HelloScene.svelte         # Scene content (camera, sphere, ground)
    ├── example/
    │   └── switch1/
    │       ├── +page.svelte          # Scene switcher page
    │       ├── CubeScene.svelte      # Cube scene
    │       ├── SphereScene.svelte    # Sphere scene
    │       └── ConeScene.svelte      # Cone scene
    └── pingpong/                     # Ping Pong game
        ├── +page.svelte              # Page + component assembly
        ├── Camera.svelte             # UniversalCamera setup
        ├── HemisphereLight.svelte    # Ambient lighting
        ├── Ground.svelte             # Grey ground mesh
        ├── Paddle.svelte             # White paddle mesh + movement
        ├── AxisGizmo.svelte          # Debug axis gizmo
        └── useMovement.ts            # Reusable keyboard movement composable
```

## Architecture

Each game route follows a **declarative Svelte-Babylon component hierarchy**. The Ping Pong scene, for example, is assembled like this:

```
Canvas
└── Scene
    ├── Camera
    ├── HemisphereLight
    ├── Ground
    ├── Paddle
    └── AxisGizmo (debug only)
```

- `Canvas` creates the engine and reactive canvas sizing
- `Scene` creates the scene and provides it via context
- Each Babylon object is a focused Svelte component
- Shared page chrome (layout, controls, canvas frame) is styled from `src/lib/styles/app.css`
- Fullscreen state is handled by the `fullscreen.svelte.ts` runes store

Contexts are limited to `EngineContext` and `SceneContext`. Everything else is passed explicitly for clean interfaces.

## Adding a New Game

1. Create a new route folder under `src/routes/` (e.g., `src/routes/my-game/`)
2. Add a `+page.svelte` with your Babylon.js scene
3. Put shared game logic under `src/lib/` or inside the route folder
4. Register the game in `src/routes/+page.svelte` by adding to the `games` array

## License

Private
