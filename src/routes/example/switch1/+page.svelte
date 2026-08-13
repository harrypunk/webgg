<script lang="ts">
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import GameLayout from '$lib/components/GameLayout.svelte';
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

	function next() {
		activeIndex = (activeIndex + 1) % scenes.length;
	}

	function prev() {
		activeIndex = (activeIndex - 1 + scenes.length) % scenes.length;
	}

	const ActiveScene = $derived(scenes[activeIndex].component);
</script>

<GameLayout title="Switch Scene Example">
	<Canvas>
		{#key activeIndex}
			<Scene bind:scene>
				<ActiveScene />
			</Scene>
		{/key}
	</Canvas>
	{#snippet panel()}
		<h2>Scene</h2>
		<div class="switcher">
			<span class="label">{scenes[activeIndex].name}</span>
			<div class="switcher-buttons">
				<button onclick={prev}>Prev</button>
				<button onclick={next}>Next</button>
			</div>
		</div>
	{/snippet}
</GameLayout>

<style>
	.switcher {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		color: var(--color-primary);
		text-align: center;
	}

	.switcher-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.switcher-buttons button {
		flex: 1;
	}
</style>
