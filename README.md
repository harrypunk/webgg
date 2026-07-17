# WebGG

A website hosting multiple [Babylon.js](https://www.babylonjs.com/) games and experiments, built with [SvelteKit](https://svelte.dev/docs/kit).

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) — full-stack web framework
- [Babylon.js](https://www.babylonjs.com/) — 3D game engine
- [Bun](https://bun.sh/) — package manager and runtime
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)

## Games

| Game           | Route                                              | Description                                                                        |
| -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Hello Babylon  | [`/hello`](./src/routes/hello)                     | Basic Babylon.js playground with a spinning sphere                                 |
| Ping Pong      | [`/pingpong`](./src/routes/pingpong)               | Simple paddle scene with a white paddle, grey floor, directional light, and shadow |
| Scene Switcher | [`/example/switch1`](./src/routes/example/switch1) | Cycle through cube, sphere, and cone scenes                                        |
| Square         | [`/example/square`](./src/routes/example/square)   | Keyboard-moved square rendered with an orthographic camera                         |

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
│   │   ├── OrthographicCamera.svelte # Shared orthographic camera
│   │   ├── context.ts                # EngineContext + SceneContext
│   │   └── useMovement.ts            # Reusable keyboard movement composable
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
    │   ├── square/
    │   │   ├── +page.svelte          # Square page
    │   │   ├── Grid.svelte           # GridMaterial background plane
    │   │   └── Square.svelte         # Keyboard-moved plane
    │   └── switch1/
    │       ├── +page.svelte          # Scene switcher page
    │       ├── ShapeScene.svelte     # Shared rotating-shape scene content
    │       ├── CubeScene.svelte      # Cube scene
    │       ├── SphereScene.svelte    # Sphere scene
    │       └── ConeScene.svelte      # Cone scene
    └── pingpong/                     # Ping Pong game
        ├── +page.svelte              # Page + component assembly
        ├── Camera.svelte             # UniversalCamera setup
        ├── HemisphereLight.svelte    # Ambient lighting
        ├── DirectionalLight.svelte   # Directional light setup
        ├── ShadowGenerator.svelte    # Shadow generator setup
        ├── Ground.svelte             # Grey ground mesh
        ├── Walls.svelte              # Transparent court walls
        ├── Paddle.svelte             # White paddle mesh + movement
        ├── AxisGizmo.svelte          # Debug axis gizmo
        ├── DebugButton.svelte        # Debug mode toggle
        └── court.ts                  # Court dimensions
```

## Architecture

Each game route follows a **declarative Svelte-Babylon component hierarchy**. The Ping Pong scene, for example, is assembled like this:

```
Canvas
└── Scene
    ├── Camera
    ├── HemisphereLight
    ├── DirectionalLight
    ├── ShadowGenerator
    ├── Ground
    ├── Paddle
    └── AxisGizmo (debug only)
```

- `Canvas` creates the engine and reactive canvas sizing
- `Scene` creates the scene and provides it via context
- Each Babylon object is a focused Svelte component
- Component props follow a strict reactivity convention — see [Reactivity Model](#reactivity-model)
- Shared page chrome (layout, controls, canvas frame) is styled from `src/lib/styles/app.css`
- Fullscreen state is handled by the `fullscreen.svelte.ts` runes store

Contexts are limited to `EngineContext` and `SceneContext`. Everything else is passed explicitly for clean interfaces.

## Reactivity Model

Babylon objects are imperative and mutable, so every wrapper component follows a strict three-tier convention for its props:

| Tier                     | Examples                                                     | What happens on change                                                                                        |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Synced props**         | `intensity`, `diffuse`, `position`, `visible`, `interactive` | A dedicated `$effect` mutates the live Babylon object in place. No rebuild.                                   |
| **Create-only props**    | `name`, geometry sizes, `mapSize`, the `mesh` factory        | Read only inside the creation effect, so changing them disposes and recreates the object (same as `{#key}`).  |
| **Live per-frame props** | `speed`, `distance`, rotation speeds                         | Read every frame inside `onBeforeRenderObservable` callbacks. Always current, never tracked, never a rebuild. |

The rules that keep this consistent:

1. **The creation effect reads only contexts** (`sceneCtx.scene`), **construction dependencies** (e.g. the `light` a `ShadowGenerator` is bound to) **and create-only props** — never synced or live props. This is what makes prop changes cheap: they cannot trigger a rebuild by accident.
2. **Every created object is stored in a `$state` handle** so sync effects re-apply their props after (re)creation. Sync effects are idempotent property writes guarded by `if (!handle) return`, which also covers the initial application.
3. **Live per-frame props must not be read synchronously by the creation effect.** Use `untrack()` for one-off initial reads (see `AxisGizmo.svelte`), and pass getters to composables — e.g. `useMovement(scene, mesh, { speed: () => speed })`.
4. **Reactivity triggers on reassignment, not in-place mutation.** Sync effects `copyFrom()` vector/color props rather than storing the passed instance, so a parent mutating its own `Vector3` never aliases into Babylon state. To change such a prop, assign a new value.
5. **Side-effecting syncs pair with cleanup**: `addShadowCaster` ↔ `removeShadowCaster`, `attachControl` ↔ `detachControl`.

`src/routes/pingpong/Camera.svelte` is the reference implementation showing all three tiers together.

## Adding a New Game

1. Create a new route folder under `src/routes/` (e.g., `src/routes/my-game/`)
2. Add a `+page.svelte` with your Babylon.js scene
3. Put shared game logic under `src/lib/` or inside the route folder
4. Register the game in `src/routes/+page.svelte` by adding to the `games` array

## License

Private
