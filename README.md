# WebGG

A website hosting multiple [Babylon.js](https://www.babylonjs.com/) games and experiments, built with [SvelteKit](https://svelte.dev/docs/kit).

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) — full-stack web framework
- [Babylon.js](https://www.babylonjs.com/) — 3D game engine
- [Bun](https://bun.sh/) — package manager and runtime
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)

## Games

| Game          | Route                                | Description                                              |
| ------------- | ------------------------------------ | -------------------------------------------------------- |
| Hello Babylon | [`/hello`](./src/routes/hello)       | Basic Babylon.js playground with a spinning sphere       |
| Space Shoot 1 | [`/spaceshoot1`](./src/routes/spaceshoot1) | Top-down space shooter — WASD to move, click to fire     |

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
│   │   ├── ship.ts                   # Shared ship mesh factory
│   │   └── spaceshoot1/              # Space Shoot 1 game logic
│   │       ├── types.ts              # Shared interfaces (Entity, System)
│   │       ├── game.ts               # Game orchestrator + scene setup
│   │       ├── input.ts              # Keyboard + pointer input
│   │       ├── movement.ts           # Movement system (pure function)
│   │       ├── boundary.ts           # Viewport boundary clamping
│   │       ├── bullets.ts            # Bullet factory + BulletSystem
│   │       ├── enemies.ts            # Enemy factory + EnemySystem
│   │       ├── collision.ts          # Collision detection + CollisionSystem
│   │       ├── player.ts             # PlayerSystem
│   │       └── background.ts         # BackgroundSystem (star particles)
│   └── assets/
└── routes/
    ├── +page.svelte                  # Homepage — game gallery
    ├── +layout.svelte                # Root layout
    ├── hello/
    │   └── +page.svelte              # Hello Babylon game
    └── spaceshoot1/
        └── +page.svelte              # Space Shoot 1 game
```

## Architecture

Games follow an **ECS-lite** pattern:

- **Entities** are plain data objects (`mesh`, `position`, `velocity`)
- **Systems** are classes that implement the `System` interface (`update(dt)`, `dispose()`)
- **Game** is a thin orchestrator — it registers systems in a list and loops them each frame

Systems are organized by domain and live in their own files:

| System            | Responsibility                                    |
| ----------------- | ------------------------------------------------- |
| `BackgroundSystem`| Scrolls star field particles                      |
| `PlayerSystem`    | Handles ship movement, input, boundary clamping   |
| `BulletSystem`    | Spawns bullets from any source, moves, cleans up  |
| `EnemySystem`     | Spawns enemies from top, moves, cleans up         |
| `CollisionSystem` | Detects bullet-enemy hits, marks both dead        |

Dependencies between systems are injected via **callbacks**, not concrete types — e.g. `BulletSystem` takes `getSpawnPosition: () => Vector3` and `isFiring: () => boolean`, so it can be reused for player, enemies, or turrets without change.

## Adding a New Game

1. Create a new route folder under `src/routes/` (e.g., `src/routes/my-game/`)
2. Add a `+page.svelte` with your Babylon.js scene
3. Put shared game logic under `src/lib/babylon/my-game/`
4. Register the game in `src/routes/+page.svelte` by adding to the `games` array

## License

Private
