<script lang="ts">
	import { Engine } from '@babylonjs/core/Engines/engine';
	import type { Scene } from '@babylonjs/core/scene';

	interface Props {
		createScene: (engine: Engine, canvas: HTMLCanvasElement) => Scene;
	}

	let { createScene }: Props = $props();

	let canvasRef: HTMLCanvasElement;
	let wrapRef: HTMLDivElement;

	$effect(() => {
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
</script>

<div class="canvas-wrap" bind:this={wrapRef}>
	<canvas bind:this={canvasRef}></canvas>
</div>

<style>
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
</style>
