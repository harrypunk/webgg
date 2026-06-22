<script lang="ts">
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import HelloScene from './HelloScene.svelte';

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);
</script>

<section class="page">
	<h1>Hello Babylon</h1>
	<div class="controls">
		<FullscreenButton {fullscreenController} />
	</div>
	<Canvas bind:element={canvasElement}>
		<Scene bind:scene>
			<HelloScene />
		</Scene>
		<FullscreenIcon {fullscreenController} />
	</Canvas>
</section>
