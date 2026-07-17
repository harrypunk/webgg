<script lang="ts">
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import OrthographicCamera from '$lib/babylon/OrthographicCamera.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import { PannedCamera } from '$lib/babylon/pannedCamera.svelte.js';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import { createMiddleMousePan } from '$lib/attachments/middleMousePan.svelte.js';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import Grid from './Grid.svelte';
	import Square from './Square.svelte';
	import CameraTools from './CameraTools.svelte';

	// Matches the grid's main color so the background blends seamlessly.
	const CLEAR_COLOR = new Color4(0.16, 0.16, 0.22, 1);
	const WORLD_HEIGHT = 10;

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);

	const camera = new PannedCamera(WORLD_HEIGHT, () => scene?.getEngine().getRenderHeight() ?? 0);
	createMiddleMousePan(() => canvasElement, camera.panPixels);
</script>

<section class="page">
	<h1>Square</h1>
	<div class="controls">
		<span class="hint">Move with <kbd>A</kbd> / <kbd>D</kbd> · Pan: middle-mouse drag</span>
		<FullscreenButton {fullscreenController} />
	</div>
	<div class="canvas-layout">
		<Canvas bind:element={canvasElement}>
			<Scene bind:scene clearColor={CLEAR_COLOR}>
				<OrthographicCamera
					position={camera.position}
					target={camera.target}
					worldHeight={WORLD_HEIGHT}
				/>
				<HemisphereLight intensity={0.9} />
				<Grid />
				<Square />
			</Scene>
			<FullscreenIcon {fullscreenController} />
		</Canvas>
		<CameraTools position={camera.position} onPan={camera.pan} />
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
