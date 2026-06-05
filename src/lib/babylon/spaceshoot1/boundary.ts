import type { Scene } from '@babylonjs/core/scene';
import type { Entity } from './game';

export function boundarySystem(entity: Entity, scene: Scene) {
	const camera = scene.activeCamera;
	if (!camera) return;

	const engine = scene.getEngine();
	const aspect = engine.getAspectRatio(camera);
	const fov = camera.fov;
	const distance = camera.position.y;

	const halfHeight = Math.tan(fov / 2) * distance;
	const halfWidth = halfHeight * aspect;

	const margin = 0.6;

	entity.position.x = Math.max(
		-halfWidth + margin,
		Math.min(halfWidth - margin, entity.position.x)
	);
	entity.position.z = Math.max(
		-halfHeight + margin,
		Math.min(halfHeight - margin, entity.position.z)
	);
	entity.mesh.position.copyFrom(entity.position);
}
