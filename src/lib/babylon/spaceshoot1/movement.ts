import type { Entity } from './game';
import type { InputState } from './input';

export interface Movable {
	speed: number;
}

export function movementSystem(entities: Array<Entity & Movable>, input: InputState, dt: number) {
	for (const entity of entities) {
		let dx = 0;
		let dz = 0;

		if (input.up) dz -= 1;
		if (input.down) dz += 1;
		if (input.left) dx += 1;
		if (input.right) dx -= 1;

		const len = Math.sqrt(dx * dx + dz * dz);
		if (len > 0) {
			dx /= len;
			dz /= len;
		}

		entity.position.x += dx * entity.speed * dt;
		entity.position.z += dz * entity.speed * dt;
		entity.mesh.position.copyFrom(entity.position);
	}
}
