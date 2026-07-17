<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import OrthographicCamera from '$lib/babylon/OrthographicCamera.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import Grid from './Grid.svelte';
	import Square from './Square.svelte';

	// Matches the grid's main color so the background blends seamlessly.
	const CLEAR_COLOR = new Color4(0.16, 0.16, 0.22, 1);
	const CAMERA_STEP = 1;

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);

	let cameraPosition = $state(new Vector3(0, 0, -10));
	let cameraTarget = $state(Vector3.Zero());

	// Pan the camera while keeping its view direction fixed: the target moves
	// with the position. Reassigning both vectors triggers the camera's synced
	// props, so each click exercises the prop → camera pipeline.
	function panCamera(dx: number, dy: number) {
		cameraPosition = cameraPosition.add(new Vector3(dx * CAMERA_STEP, dy * CAMERA_STEP, 0));
		cameraTarget = cameraPosition.add(new Vector3(0, 0, 10));
	}
</script>

<section class="page">
	<h1>Square</h1>
	<div class="controls">
		<span class="hint">Move with <kbd>A</kbd> / <kbd>D</kbd></span>
		<FullscreenButton {fullscreenController} />
	</div>
	<div class="canvas-layout">
		<Canvas bind:element={canvasElement}>
			<Scene bind:scene clearColor={CLEAR_COLOR}>
				<OrthographicCamera position={cameraPosition} target={cameraTarget} worldHeight={10} />
				<HemisphereLight intensity={0.9} />
				<Grid />
				<Square />
			</Scene>
			<FullscreenIcon {fullscreenController} />
		</Canvas>
		<aside class="tools">
			<h2>Tools</h2>
			<div class="pad">
				<button onclick={() => panCamera(0, 1)}>Up</button>
				<div class="pad-row">
					<button onclick={() => panCamera(-1, 0)}>Left</button>
					<button onclick={() => panCamera(1, 0)}>Right</button>
				</div>
				<button onclick={() => panCamera(0, -1)}>Down</button>
			</div>
			<p class="readout">
				camera: {cameraPosition.x.toFixed(1)}, {cameraPosition.y.toFixed(1)}
			</p>
		</aside>
	</div>
</section>

<style>
	.hint {
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.hint kbd {
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		background: var(--color-bg);
		color: var(--color-primary);
	}

	.canvas-layout {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		overflow: hidden;
	}

	.tools {
		width: 180px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		box-shadow: var(--glow-primary-lg);
	}

	.tools h2 {
		font-size: 1rem;
		color: var(--color-primary);
		text-shadow: var(--glow-primary-sm);
		margin: 0;
	}

	.pad {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.pad-row {
		display: flex;
		gap: 0.5rem;
	}

	.pad button {
		padding: 0.4rem 0.8rem;
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		background: var(--color-surface);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: 4px;
	}

	.pad button:hover {
		background: var(--color-primary);
		color: var(--color-bg);
	}

	.readout {
		font-size: 0.85rem;
		color: var(--color-text);
		text-align: center;
	}
</style>
