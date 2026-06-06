import type { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { createShipMesh } from '$lib/babylon/ship';
import { createInputState } from './input';
import { movementSystem } from './movement';
import type { Movable } from './movement';
import { boundarySystem } from './boundary';
import type { Entity } from './types';
import type { System } from './types';

export class PlayerSystem implements System {
	readonly player: Entity & Movable;
	private readonly input: ReturnType<typeof createInputState>;

	constructor(scene: Scene, input: ReturnType<typeof createInputState>) {
		this.input = input;
		this.player = {
			mesh: createShipMesh(scene, 'player'),
			position: new Vector3(0, 0.1, 0),
			velocity: Vector3.Zero(),
			speed: 8
		};
		this.player.mesh.scaling.setAll(0.5);
		this.player.mesh.position.copyFrom(this.player.position);
	}

	update(dt: number) {
		movementSystem([this.player], this.input.state, dt);
		boundarySystem(this.player, this.player.mesh.getScene());
	}

	dispose() {
		this.input.dispose();
		this.player.mesh.dispose();
	}
}
