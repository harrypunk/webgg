import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';

/** A 2D input direction: strafe right and move forward, each in [-1, 1]. */
export interface InputVector {
	right: number;
	forward: number;
}

/**
 * An abstract input device producing a movement vector on demand, e.g.
 * canvas-scoped WASD keys or a gamepad stick.
 */
export interface InputVectorSource {
	/** Reads the current input vector. Called every render tick. */
	read(): InputVector;
	/** Releases listeners/subscriptions, if the source holds any. */
	detach?(): void;
}

export interface MovementOptions {
	/**
	 * Movement speed in units per second, as a getter (e.g. `() => speed`) so
	 * it is read live every frame and prop updates apply immediately without
	 * recreating anything.
	 */
	speed: () => number;
	/**
	 * Getter for the current "forward" axis (unit vector), e.g. the view
	 * forward published by a camera, or a constant for world-aligned
	 * movement. Forward input moves along it. Pass a getter so the axis is
	 * read live every frame.
	 */
	frontAxis: () => Vector3;
	/**
	 * Getter for the "strafe right" axis (unit vector). Defaults to
	 * up×front, which suits movement on the XZ ground plane; pass an
	 * explicit axis for scenes on another plane (e.g. a 2D XY scene).
	 */
	rightAxis?: () => Vector3;
	/**
	 * Input devices to combine. The manager takes over their lifetime and
	 * detaches them when its own detach function is called.
	 */
	sources: InputVectorSource[];
	/**
	 * Called every frame while input is active, with the frame's displacement
	 * vector (units, scaled by speed and delta time). What happens with it —
	 * move a mesh, collide, steer facing — is the caller's decision.
	 */
	onMove: (displacement: Vector3) => void;
}

/**
 * Movement manager: on every scene render tick it combines the vectors from
 * its input `sources`, maps the result onto the front/right axes, and
 * reports a delta-time-scaled displacement via `onMove`. The combined input
 * length is capped at 1, so diagonal keyboard input is not faster than
 * straight while analog (gamepad) magnitude is preserved.
 *
 * The manager never touches any mesh — input and vector math only.
 *
 * Returns a detach function that removes the render observer and detaches
 * all input sources.
 */
export function useMovement(
	scene: Scene,
	{ speed, frontAxis, rightAxis, sources, onMove }: MovementOptions
): () => void {
	const observer = scene.onBeforeRenderObservable.add(() => {
		let right = 0;
		let forward = 0;
		for (const source of sources) {
			const v = source.read();
			right += v.right;
			forward += v.forward;
		}
		if (right === 0 && forward === 0) return;

		const input = new Vector3(right, 0, forward);
		if (input.lengthSquared() > 1) input.normalize();

		const front = frontAxis();
		// Default: ground-plane movement, right = up×front.
		const strafe = rightAxis?.() ?? Vector3.Cross(Vector3.Up(), front);
		const direction = front.scale(input.z).add(strafe.scale(input.x));

		const dt = scene.getEngine().getDeltaTime() / 1000;
		onMove(direction.scale(speed() * dt));
	});

	return () => {
		scene.onBeforeRenderObservable.remove(observer);
		for (const source of sources) {
			source.detach?.();
		}
	};
}
