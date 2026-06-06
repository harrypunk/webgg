import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Vector3 } from '@babylonjs/core/Maths/math.vector';

export interface Entity {
	mesh: Mesh;
	position: Vector3;
	velocity: Vector3;
}

export interface System {
	update(dt: number): void;
	dispose(): void;
}
