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

	constructor(scene: Scene) {
		this.scene = scene;
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

	createGrid(scene, 24, 12);
	createStarfield(scene, 80);
}

function createGrid(scene: Scene, size: number, divisions: number) {
	const color = new Color3(0.08, 0.08, 0.12);
	const half = size / 2;
	const step = size / divisions;

	for (let i = 0; i <= divisions; i++) {
		const pos = -half + i * step;
		MeshBuilder.CreateLines(
			'gridH' + i,
			{ points: [new Vector3(-half, 0, pos), new Vector3(half, 0, pos)] },
			scene
		).color = color;
		MeshBuilder.CreateLines(
			'gridV' + i,
			{ points: [new Vector3(pos, 0, -half), new Vector3(pos, 0, half)] },
			scene
		).color = color;
	}
}

function createStarfield(scene: Scene, count: number) {
	const starMat = new StandardMaterial('starMat', scene);
	starMat.disableLighting = true;
	starMat.emissiveColor = new Color3(0.8, 0.8, 1);

	for (let i = 0; i < count; i++) {
		const x = (Math.random() - 0.5) * 40;
		const z = (Math.random() - 0.5) * 40;
		const y = -0.2 - Math.random() * 0.5;
		const star = MeshBuilder.CreateBox('star' + i, { size: 0.04 + Math.random() * 0.04 }, scene);
		star.position.set(x, y, z);
		star.material = starMat;
	}
}
