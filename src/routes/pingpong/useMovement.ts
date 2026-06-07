import type { Scene } from '@babylonjs/core/scene';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

export interface MovementOptions {
	speed: number;
	leftKey?: string;
	rightKey?: string;
}

/**
 * Attaches keyboard-driven horizontal movement to a Babylon mesh.
 *
 * Listens for configurable key codes and updates mesh.position.x on every
 * scene render tick using delta time for frame-rate-independent motion.
 *
 * Returns a detach function to clean up listeners and the render observer.
 */
export function useMovement(
	scene: Scene,
	mesh: AbstractMesh,
	{ speed, leftKey = 'KeyA', rightKey = 'KeyD' }: MovementOptions
): () => void {
	const input = { left: false, right: false };

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
		if (input.left) mesh.position.x -= speed * dt;
		if (input.right) mesh.position.x += speed * dt;
	});

	return () => {
		scene.onBeforeRenderObservable.remove(observer);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};
}
