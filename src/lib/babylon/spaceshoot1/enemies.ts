import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';

export interface Enemy {
	mesh: Mesh;
	alive: boolean;
	speed: number;
}

export function createEnemyMaterial(scene: Scene): StandardMaterial {
	const mat = new StandardMaterial('enemyMat', scene);
	mat.disableLighting = true;
	mat.emissiveColor = new Color3(1, 0.2, 0.2);
	return mat;
}

export function spawnEnemy(scene: Scene, x: number, z: number, material: StandardMaterial): Enemy {
	const mesh = MeshBuilder.CreateBox('enemy', { size: 0.6 }, scene);
	mesh.material = material;
	mesh.position.set(x, 0.1, z);
	return { mesh, alive: true, speed: 2 + Math.random() * 2 };
}

export function enemyMovementSystem(enemies: Enemy[], dt: number) {
	for (const enemy of enemies) {
		if (!enemy.alive) continue;
		enemy.mesh.position.z += enemy.speed * dt;
	}
}

export function cleanupEnemies(enemies: Enemy[]): Enemy[] {
	const alive: Enemy[] = [];
	for (const enemy of enemies) {
		if (!enemy.alive || enemy.mesh.position.z > 15) {
			enemy.mesh.dispose();
		} else {
			alive.push(enemy);
		}
	}
	return alive;
}
