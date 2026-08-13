import { Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * Shared view axis connecting the camera and movement: the camera writes
 * its ground-projected forward into `front` every frame, and movement reads
 * it to steer WASD input. Plain mutable state on purpose — it is consumed
 * per render tick, not tracked by Svelte reactivity (see NOTES.md).
 */
export interface ViewAxis {
	/** Ground-projected camera forward, rewritten by the camera every frame. */
	front: Vector3;
}

export function createViewAxis(): ViewAxis {
	return { front: new Vector3(0, 0, 1) };
}
