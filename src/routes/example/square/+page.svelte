<script lang="ts">
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import OrthographicCamera from '$lib/babylon/OrthographicCamera.svelte';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import Grid from './Grid.svelte';
	import Square from './Square.svelte';

	// Matches the grid's main color so the background blends seamlessly.
	const CLEAR_COLOR = new Color4(0.08, 0.08, 0.12, 1);

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);
</script>

<section class="page">
	<h1>Square</h1>
	<div class="controls">
		<span class="hint">Move with <kbd>A</kbd> / <kbd>D</kbd></span>
		<FullscreenButton {fullscreenController} />
	</div>
	<Canvas bind:element={canvasElement}>
		<Scene bind:scene clearColor={CLEAR_COLOR}>
			<OrthographicCamera worldHeight={10} />
			<Grid />
			<Square />
		</Scene>
		<FullscreenIcon {fullscreenController} />
	</Canvas>
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
</style>
