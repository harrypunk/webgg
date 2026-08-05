import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import type { Camera } from '@babylonjs/core/Cameras/camera';
import type { Nullable } from '@babylonjs/core/types';
import '@babylonjs/core/Collisions/collisionCoordinator';
// Side-effect import: Camera.getForwardRay() constructs a Ray at runtime.
import '@babylonjs/core/Culling/ray';

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
	 * Optional camera making movement camera-relative, as in most 3D games:
	 * up moves along the camera's ground-projected forward, right strafes to
	 * its right. Pass a getter (e.g. `() => camera`) so a rebuilt camera is
	 * picked up live.
	 */
	camera?: () => Nullable<Camera>;
	useCollisions?: boolean;
}

/**
 * Attaches keyboard-driven horizontal movement to a Babylon mesh.
 *
 * Listens for configurable key codes and updates mesh.position on every
 * scene render tick using delta time for frame-rate-independent motion.
 * Left/right and the optional up/down keys form a 2D input direction; with
 * no `camera` it maps to world x/z (up toward +z), otherwise it is rotated
 * into the camera's view frame. Diagonal motion is normalized so it is not
 * faster than straight motion.
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
		camera,
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
		const cam = camera?.();
		if (cam) {
			// Camera-relative: rotate input into the camera's ground-projected
			// frame — up along its forward, right along up×forward.
			const forward = cam.getForwardRay().direction;
			forward.y = 0;
			forward.normalize();
			const right = Vector3.Cross(Vector3.Up(), forward);
			direction = forward.scale(z).add(right.scale(x));
		}

		const currentSpeed = typeof speed === 'function' ? speed() : speed;
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
