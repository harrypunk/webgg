import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import '@babylonjs/core/Collisions/collisionCoordinator';

export interface MovementOptions {
	speed: number;
	leftKey?: string;
	rightKey?: string;
	useCollisions?: boolean;
}

/**
 * Attaches keyboard-driven horizontal movement to a Babylon mesh.
 *
 * Listens for configurable key codes and updates mesh.position.x on every
 * scene render tick using delta time for frame-rate-independent motion.
 *
 * When `useCollisions` is true, movement uses `moveWithCollisions`, so the
 * mesh is constrained by any scene meshes marked as collision meshes.
 *
 * Returns a detach function to clean up listeners and the render observer.
 */
export function useMovement(
	scene: Scene,
	mesh: AbstractMesh,
	{ speed, leftKey = 'KeyA', rightKey = 'KeyD', useCollisions = false }: MovementOptions
): () => void {
	const input = { left: false, right: false };

	if (useCollisions) {
		mesh.checkCollisions = true;
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.code === leftKey) input.left = true;
		if (e.code === rightKey) input.right = true;
	};

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.code === leftKey) input.left = false;
		if (e.code === rightKey) input.right = false;
	};

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	const observer = scene.onBeforeRenderObservable.add(() => {
		const dt = scene.getEngine().getDeltaTime() / 1000;
		const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
		if (direction === 0) return;

		const distance = direction * speed * dt;
		if (useCollisions) {
			mesh.moveWithCollisions(new Vector3(distance, 0, 0));
		} else {
			mesh.position.x += distance;
		}
	});

	return () => {
		scene.onBeforeRenderObservable.remove(observer);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};
}
