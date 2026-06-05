<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { Engine } from '@babylonjs/core/Engines/engine';
	import { Scene } from '@babylonjs/core/scene';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { Mesh } from '@babylonjs/core/Meshes/mesh';
	import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

	let canvasRef: HTMLCanvasElement;
	let wrapRef: HTMLDivElement;

	onMount(() => {
		const rect = wrapRef.getBoundingClientRect();
		canvasRef.width = rect.width;
		canvasRef.height = rect.height;

		const engine = new Engine(canvasRef, true);
		const scene = createScene(engine);

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

	function createScene(engine: Engine): Scene {
		const scene = new Scene(engine);
		scene.clearColor = new Color4(0.02, 0.02, 0.04, 1);

		const camera = new FreeCamera('camera1', new Vector3(0, 15, 0), scene);
		camera.setTarget(Vector3.Zero());

		const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
		light.intensity = 0.8;

		const ship = createTriangleShip(scene);
		ship.position.y = 0.1;

		const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);
		const groundMat = new StandardMaterial('groundMat', scene);
		groundMat.diffuseColor = new Color3(0.1, 0.1, 0.15);
		ground.material = groundMat;

		return scene;
	}

	function createTriangleShip(scene: Scene): Mesh {
		const mesh = new Mesh('ship', scene);

		const vertexData = new VertexData();
		vertexData.positions = [
			0,
			0,
			1, // nose
			-0.5,
			0,
			-0.6, // left wing
			0.5,
			0,
			-0.6 // right wing
		];
		vertexData.indices = [0, 1, 2];
		vertexData.normals = [0, 1, 0, 0, 1, 0, 0, 1, 0];
		vertexData.applyToMesh(mesh);

		const mat = new StandardMaterial('shipMat', scene);
		mat.diffuseColor = new Color3(0, 0.85, 1);
		mat.emissiveColor = new Color3(0, 0.3, 0.4);
		mesh.material = mat;

		return mesh;
	}
</script>

<section class="page">
	<h1>Space Shoot 1</h1>
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
