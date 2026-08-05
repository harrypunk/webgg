import { Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * Shared view axis connecting the camera and movement: the camera writes
 * its ground-projected forward into `front` every frame, and movement reads
 * it to steer WASD input. Plain mutable state on purpose — it is consumed
 * per render tick, not tracked by Svelte reactivity.
 */
export function createViewAxis() {
	return { front: new Vector3(0, 0, 1) };
}

export type ViewAxis = ReturnType<typeof createViewAxis>;
