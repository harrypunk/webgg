<script lang="ts">
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import { fullscreen } from '$lib/attachments/fullscreen';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import HelloScene from './HelloScene.svelte';

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
</script>

<section class="page">
	<h1>Hello Babylon</h1>
	<div class="controls">
		<FullscreenButton {@attach fullscreen(canvasElement)} />
	</div>
	<Canvas bind:element={canvasElement}>
		<Scene bind:scene>
			<HelloScene />
		</Scene>
		<FullscreenIcon {@attach fullscreen(canvasElement)} />
	</Canvas>
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

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
