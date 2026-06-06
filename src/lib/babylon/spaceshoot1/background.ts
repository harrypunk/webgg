import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { System } from './types';

export class BackgroundSystem implements System {
	private readonly particles: Mesh[];

	constructor(scene: Scene) {
		this.particles = createParticles(scene, 60);
	}

	update(dt: number) {
		scrollParticles(this.particles, dt);
	}

	dispose() {
		for (const p of this.particles) p.dispose();
	}
}

function scrollParticles(particles: Mesh[], dt: number) {
	const speed = 3;
	for (const p of particles) {
		p.position.z += speed * dt;
		if (p.position.z > 15) {
			p.position.z -= 30;
			p.position.x = (Math.random() - 0.5) * 30;
		}
	}
}

function createParticles(scene: Scene, count: number): Mesh[] {
	const mat = new StandardMaterial('particleMat', scene);
	mat.disableLighting = true;
	mat.emissiveColor = new Color3(0.6, 0.7, 1);

	const particles: Mesh[] = [];
	for (let i = 0; i < count; i++) {
		const p = MeshBuilder.CreateBox('p' + i, { size: 0.02 + Math.random() * 0.04 }, scene);
		p.position.x = (Math.random() - 0.5) * 30;
		p.position.z = (Math.random() - 0.5) * 30;
		p.position.y = -0.5 - Math.random() * 2;
		p.material = mat;
		particles.push(p);
	}
	return particles;
}
