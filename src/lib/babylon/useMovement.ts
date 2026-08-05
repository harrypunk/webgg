import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { Nullable } from '@babylonjs/core/types';
import '@babylonjs/core/Collisions/collisionCoordinator';

export interface MovementOptions {
	/**
	 * Movement speed in units per second. Pass a getter (e.g. `() => speed`)
	 * to keep the value live: it is then read every frame, so prop updates
	 * apply immediately without recreating anything.
	 */
	speed: number | (() => number);
	leftKey?: string;
	rightKey?: string;
	/** Optional: when set, the mesh also moves on the z axis (W/S-style). */
	upKey?: string;
	downKey?: string;
	/**
	 * Optional getter for the current "forward" axis (unit vector on the XZ
	 * plane), e.g. the view forward published by a camera. When set, up/down
	 * move along it and left/right strafe perpendicular; without it, up is
	 * world +z. Pass a getter so the axis is read live every frame.
	 */
	frontAxis?: () => Nullable<Vector3>;
	/**
	 * When true, yaw the mesh so its +z faces the direction it is moving.
	 * Meshes not modeled pointing along +z should bake their pose first.
	 */
	faceForward?: boolean;
	useCollisions?: boolean;
}

/**
 * Attaches keyboard-driven horizontal movement to a Babylon mesh.
 *
 * Listens for configurable key codes and updates mesh.position on every
 * scene render tick using delta time for frame-rate-independent motion.
 * Left/right and the optional up/down keys form a 2D input direction; it is
 * mapped onto the `frontAxis` (world +z by default), so whoever owns the
 * axis — e.g. an orbit camera — controls where "forward" points. Diagonal
 * motion is normalized so it is not faster than straight motion.
 *
 * When `useCollisions` is true, movement uses `moveWithCollisions`, so the
 * mesh is constrained by any scene meshes marked as collision meshes.
 *
 * Returns a detach function to clean up listeners and the render observer.
 */
export function useMovement(
	scene: Scene,
	mesh: AbstractMesh,
	{
		speed,
		leftKey = 'KeyA',
		rightKey = 'KeyD',
		upKey,
		downKey,
		frontAxis,
		faceForward = false,
		useCollisions = false
	}: MovementOptions
): () => void {
	const input = { left: false, right: false, up: false, down: false };

	if (useCollisions) {
		mesh.checkCollisions = true;
	}

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

		let direction = new Vector3(x, 0, z);
		const front = frontAxis?.();
		if (front) {
			// Axis-relative: up along the front axis, right along up×front.
			const right = Vector3.Cross(Vector3.Up(), front);
			direction = front.scale(z).add(right.scale(x));
		}

		const currentSpeed = typeof speed === 'function' ? speed() : speed;
		if (faceForward) {
			// Yaw so the mesh's +z faces the way it is moving.
			mesh.rotation.y = Math.atan2(direction.x, direction.z);
		}
		const displacement = direction.normalize().scale(currentSpeed * dt);
		if (useCollisions) {
			mesh.moveWithCollisions(displacement);
		} else {
			mesh.position.addInPlace(displacement);
		}
	});

	return () => {
		scene.onBeforeRenderObservable.remove(observer);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};
}
