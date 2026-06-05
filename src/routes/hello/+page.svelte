<script lang="ts">
	import { Engine } from '@babylonjs/core/Engines/engine';
	import { Scene } from '@babylonjs/core/scene';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import BabylonCanvas from '$lib/babylon/BabylonCanvas.svelte';
	import { CanvasSize } from '$lib/babylon/canvasSize';

	function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
		const scene = new Scene(engine);
		scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

		const camera = new ArcRotateCamera(
			'camera1',
			-Math.PI / 2,
			Math.PI / 2.5,
			10,
			Vector3.Zero(),
			scene
		);
		camera.attachControl(canvas, true);

		const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
		light.intensity = 0.7;

		const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);
		sphere.position.y = 1;

		const sphereMat = new StandardMaterial('sphereMat', scene);
		sphereMat.diffuseColor = new Color3(1, 0.2, 0.2);
		sphere.material = sphereMat;

		const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

		const groundMat = new StandardMaterial('groundMat', scene);
		groundMat.diffuseColor = new Color3(0.3, 0.5, 0.3);
		ground.material = groundMat;

		scene.registerBeforeRender(() => {
			sphere.rotation.y += 0.01;
		});

		return scene;
	}
</script>

<section class="page">
	<h1>Hello Babylon</h1>
	<BabylonCanvas {createScene} size={CanvasSize.Landscape} />
</section>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	h1 {
		font-size: 1.75rem;
		color: #ffff00;
		text-shadow: 0 0 8px #ffff00;
	}
</style>
