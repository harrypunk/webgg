import type { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { createInputState } from './input';
import { BackgroundSystem } from './background';
import { PlayerSystem } from './player';
import { BulletSystem } from './bullets';
import { EnemySystem } from './enemies';
import { CollisionSystem } from './collision';
import type { System } from './types';

export class Game {
	private readonly systems: System[];

	constructor(scene: Scene) {
		const input = createInputState(scene);
		const player = new PlayerSystem(scene, input);
		const bullets = new BulletSystem(
			scene,
			() => player.player.mesh.position,
			() => input.state.fire
		);
		const enemies = new EnemySystem(scene);

		this.systems = [
			new BackgroundSystem(scene),
			player,
			bullets,
			enemies,
			new CollisionSystem(bullets, enemies)
		];
	}

	update(dt: number) {
		for (const system of this.systems) {
			system.update(dt);
		}
	}

	dispose() {
		for (const system of this.systems) {
			system.dispose();
		}
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
