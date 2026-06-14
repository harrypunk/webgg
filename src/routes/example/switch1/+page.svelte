<script lang="ts">
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import { fullscreen } from '$lib/attachments/fullscreen';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import CubeScene from './CubeScene.svelte';
	import SphereScene from './SphereScene.svelte';
	import ConeScene from './ConeScene.svelte';

	const scenes = [
		{ name: 'Cube', component: CubeScene },
		{ name: 'Sphere', component: SphereScene },
		{ name: 'Cone', component: ConeScene }
	];

	let activeIndex = $state(0);
	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();

	function next() {
		activeIndex = (activeIndex + 1) % scenes.length;
	}

	function prev() {
		activeIndex = (activeIndex - 1 + scenes.length) % scenes.length;
	}

	const ActiveScene = $derived(scenes[activeIndex].component);
</script>

<section class="page">
	<h1>Switch Scene Example</h1>
	<div class="controls">
		<button onclick={prev}>Prev</button>
		<span class="label">{scenes[activeIndex].name}</span>
		<button onclick={next}>Next</button>
		<FullscreenButton {@attach fullscreen(canvasElement)} />
	</div>
	<Canvas bind:element={canvasElement}>
		{#key activeIndex}
			<Scene bind:scene>
				<ActiveScene />
			</Scene>
		{/key}
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

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		background: #00ff41;
		color: #000;
		border: none;
		border-radius: 4px;
	}

	button:hover {
		background: #33ff66;
	}

	.label {
		font-size: 1.25rem;
		color: #00ff41;
		min-width: 6rem;
		text-align: center;
	}
</style>
