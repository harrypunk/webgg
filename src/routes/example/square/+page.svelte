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
	import CameraTools from './CameraTools.svelte';

	// Matches the grid's main color so the background blends seamlessly.
	const CLEAR_COLOR = new Color4(0.16, 0.16, 0.22, 1);

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);

	let cameraPosition = $state(new Vector3(0, 0, -10));
	let cameraTarget = $state(Vector3.Zero());

	const CAMERA_STEP = 1;

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
		<CameraTools position={cameraPosition} onPan={panCamera} />
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
</style>
