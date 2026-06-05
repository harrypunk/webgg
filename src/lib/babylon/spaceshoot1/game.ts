import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
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
	scene.clearColor = new Color4(0.02, 0.02, 0.04, 1);

	const camera = new FreeCamera('camera1', new Vector3(0, 15, 0), scene);
	camera.setTarget(Vector3.Zero());

	const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
	light.intensity = 0.8;

	const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);
	const groundMat = new StandardMaterial('groundMat', scene);
	groundMat.diffuseColor = new Color3(0.1, 0.1, 0.15);
	ground.material = groundMat;
}
