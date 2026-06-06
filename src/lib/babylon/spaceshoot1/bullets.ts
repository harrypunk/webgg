import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';

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
