import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { createShipMesh } from '$lib/babylon/ship';
import { createInputState } from './input';
import { movementSystem } from './movement';
import type { Movable } from './movement';
import { boundarySystem } from './boundary';

export interface Entity {
	mesh: Mesh;
	position: Vector3;
	velocity: Vector3;
}

export class Game {
	readonly scene: Scene;
	readonly player: Entity & Movable;
	private readonly input = createInputState();
	private readonly particles: Mesh[];

	constructor(scene: Scene) {
		this.scene = scene;
		this.particles = createParticles(scene, 60);
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
		scrollParticles(this.particles, dt);
		movementSystem([this.player], this.input.state, dt);
		boundarySystem(this.player, this.scene);
	}

	dispose() {
		this.input.dispose();
		this.player.mesh.dispose();
	}
}

export function createBaseScene(scene: Scene) {
	scene.clearColor = new Color4(0, 0, 0, 1);

	const camera = new FreeCamera('camera1', new Vector3(0, 15, 0), scene);
	camera.setTarget(Vector3.Zero());

	const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
	light.intensity = 0.3;
	light.diffuse = new Color3(0.7, 0.7, 0.9);

	const glow = new GlowLayer('glow', scene);
	glow.intensity = 0.6;
}

export function scrollParticles(particles: Mesh[], dt: number) {
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
