<script lang="ts">
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import HelloScene from './HelloScene.svelte';
</script>

<section class="page">
	<h1>Hello Babylon</h1>
	<Canvas>
		<Scene>
			<HelloScene />
		</Scene>
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
</style>
