import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';

export interface MovementOptions {
	/**
	 * Movement speed in units per second, as a getter (e.g. `() => speed`) so
	 * it is read live every frame and prop updates apply immediately without
	 * recreating anything.
	 */
	speed: () => number;
	leftKey?: string;
	rightKey?: string;
	/** Optional: when set, up/down keys are tracked too (W/S-style). */
	upKey?: string;
	downKey?: string;
	/**
	 * Getter for the current "forward" axis (unit vector on the XZ plane),
	 * e.g. the view forward published by a camera, or a constant for
	 * world-aligned movement. Up/down move along it and left/right strafe
	 * perpendicular. Pass a getter so the axis is read live every frame.
	 */
	frontAxis: () => Vector3;
	/**
	 * Called every frame while keys are held, with the frame's displacement
	 * vector (units, scaled by speed and delta time). What happens with it —
	 * move a mesh, collide, steer facing — is the caller's decision.
	 */
	onMove: (displacement: Vector3) => void;
}

/**
 * Listens for configurable WASD-style key codes and, on every scene render
 * tick, turns the held keys into a delta-time-scaled displacement vector on
 * the XZ plane, reported via `onMove`. The input direction is mapped onto
 * `frontAxis` (up along it, right along up×front). Diagonal motion is
 * normalized so it is not faster than straight motion.
 *
 * The helper never touches any mesh — input and vector math only.
 *
 * Returns a detach function to clean up listeners and the render observer.
 */
export function useMovement(
	scene: Scene,
	{ speed, leftKey = 'KeyA', rightKey = 'KeyD', upKey, downKey, frontAxis, onMove }: MovementOptions
): () => void {
	const input = { left: false, right: false, up: false, down: false };

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.code === leftKey) input.left = true;
		if (e.code === rightKey) input.right = true;
		if (e.code === upKey) input.up = true;
		if (e.code === downKey) input.down = true;
	};

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.code === leftKey) input.left = false;
		if (e.code === rightKey) input.right = false;
		if (e.code === upKey) input.up = false;
		if (e.code === downKey) input.down = false;
	};

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	const observer = scene.onBeforeRenderObservable.add(() => {
		const dt = scene.getEngine().getDeltaTime() / 1000;
		const x = (input.right ? 1 : 0) - (input.left ? 1 : 0);
		const z = (input.up ? 1 : 0) - (input.down ? 1 : 0);
		if (x === 0 && z === 0) return;

		// Axis-relative: up along the front axis, right along up×front.
		const front = frontAxis();
		const right = Vector3.Cross(Vector3.Up(), front);
		const direction = front.scale(z).add(right.scale(x));

		const currentSpeed = speed();
		onMove(direction.normalize().scale(currentSpeed * dt));
	});

	return () => {
		scene.onBeforeRenderObservable.remove(observer);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};
}
