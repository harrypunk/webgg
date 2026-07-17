import { Vector3 } from '@babylonjs/core/Maths/math.vector';

// Fixed offset from position to target, so panning never tilts the camera.
const VIEW_OFFSET = new Vector3(0, 0, 10);

/**
 * Owns the pose of a camera that pans parallel to the XY plane.
 *
 * The reactive `position`/`target` getters are meant to feed a camera
 * component's synced props. `pan` moves both while keeping the view
 * direction fixed, and always reassigns (never mutates) so Svelte
 * reactivity fires.
 */
export class PannedCamera {
	#position = $state(new Vector3(0, 0, -10));
	#target = $state(this.#position.add(VIEW_OFFSET));

	constructor(
		private worldHeight: number,
		private renderHeight: () => number
	) {}

	get position() {
		return this.#position;
	}

	get target() {
		return this.#target;
	}

	/** Pan by world units. Arrow field so it can be passed as a callback. */
	pan = (dx: number, dy: number) => {
		this.#position = this.#position.add(new Vector3(dx, dy, 0));
		this.#target = this.#position.add(VIEW_OFFSET);
	};

	/**
	 * Pan by CSS-pixel deltas (e.g. from pointer drags), converted to world
	 * units via the current render height. Grab-the-world style: dragging
	 * right/down moves the view left/up.
	 */
	panPixels = (dxPx: number, dyPx: number) => {
		const heightPx = this.renderHeight();
		if (heightPx <= 0) return;
		const worldPerPixel = this.worldHeight / heightPx;
		this.pan(-dxPx * worldPerPixel, dyPx * worldPerPixel);
	};
}
