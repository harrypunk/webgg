import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Bullet } from './bullets';
import type { Enemy } from './enemies';
import type { BulletSystem } from './bullets';
import type { EnemySystem } from './enemies';
import type { System } from './types';

export function bulletEnemyCollision(bullets: Bullet[], enemies: Enemy[]) {
	const hitRadius = 0.5;

	for (const bullet of bullets) {
		if (!bullet.alive) continue;

		for (const enemy of enemies) {
			if (!enemy.alive) continue;

			if (Vector3.Distance(bullet.mesh.position, enemy.mesh.position) < hitRadius) {
				bullet.alive = false;
				enemy.alive = false;
				break;
			}
		}
	}
}

export class CollisionSystem implements System {
	constructor(
		private readonly bullets: BulletSystem,
		private readonly enemies: EnemySystem
	) {}

	update() {
		bulletEnemyCollision(this.bullets.items, this.enemies.items);
	}

	dispose() {}
}
