import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { System } from './types';

export interface Bullet {
	mesh: Mesh;
	alive: boolean;
	speed: number;
}

export function createBulletMaterial(scene: Scene): StandardMaterial {
	const mat = new StandardMaterial('bulletMat', scene);
	mat.disableLighting = true;
	mat.emissiveColor = new Color3(1, 1, 0);
	return mat;
}

export function spawnBullet(scene: Scene, position: Vector3, material: StandardMaterial): Bullet {
	const mesh = MeshBuilder.CreateBox('bullet', { size: 0.08 }, scene);
	mesh.material = material;
	mesh.position.copyFrom(position);
	mesh.position.z -= 0.5;
	return { mesh, alive: true, speed: 50 };
}

export function bulletMovementSystem(bullets: Bullet[], dt: number) {
	for (const bullet of bullets) {
		if (!bullet.alive) continue;
		bullet.mesh.position.z -= bullet.speed * dt;
		if (bullet.mesh.position.z < -15) {
			bullet.alive = false;
		}
	}
}

export function cleanupBullets(bullets: Bullet[]): Bullet[] {
	const alive: Bullet[] = [];
	for (const bullet of bullets) {
		if (!bullet.alive) {
			bullet.mesh.dispose();
		} else {
			alive.push(bullet);
		}
	}
	return alive;
}

export class BulletSystem implements System {
	items: Bullet[] = [];
	private readonly material: StandardMaterial;
	private fireTimer = 0;

	constructor(
		private readonly scene: Scene,
		private readonly getSpawnPosition: () => Vector3,
		private readonly isFiring: () => boolean
	) {
		this.material = createBulletMaterial(scene);
	}

	update(dt: number) {
		this.fireTimer -= dt;
		if (this.isFiring() && this.fireTimer <= 0) {
			this.items.push(spawnBullet(this.scene, this.getSpawnPosition(), this.material));
			this.fireTimer = 0.05;
		}
		bulletMovementSystem(this.items, dt);
		this.items = cleanupBullets(this.items);
	}

	dispose() {
		this.material.dispose();
		for (const b of this.items) b.mesh.dispose();
	}
}
