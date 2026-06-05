<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Engine } from '@babylonjs/core/Engines/engine';
	import { Scene } from '@babylonjs/core/scene';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

	let canvasRef: HTMLCanvasElement;
	let wrapRef: HTMLDivElement;

	onMount(() => {
		const rect = wrapRef.getBoundingClientRect();
		canvasRef.width = rect.width;
		canvasRef.height = rect.height;

		const engine = new Engine(canvasRef, true);
		const scene = createScene(engine, canvasRef);

		engine.runRenderLoop(() => {
			scene.render();
		});

		const resizeObs = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				canvasRef.width = width;
				canvasRef.height = height;
				engine.resize();
			}
		});
		resizeObs.observe(wrapRef);

		return () => {
			resizeObs.disconnect();
			scene.dispose();
			engine.dispose();
		};
	});

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
	<div class="canvas-wrap" bind:this={wrapRef}>
		<canvas bind:this={canvasRef}></canvas>
	</div>
	<a href={resolve('/')} class="back">← Back to Games</a>
</section>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 {
		font-size: 1.75rem;
		color: #ffff00;
		text-shadow: 0 0 8px #ffff00;
	}

	.canvas-wrap {
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 2px solid #00ff41;
		overflow: hidden;
		background: #000;
		box-shadow: 0 0 12px #00ff41;
	}

	canvas {
		width: 100%;
		height: 100%;
		outline: none;
	}

	.back {
		color: #00d4ff;
		text-decoration: none;
		font-size: 0.95rem;
		text-shadow: 0 0 4px #00d4ff;
	}

	.back:hover {
		color: #ffff00;
		text-shadow: 0 0 4px #ffff00;
	}
</style>
