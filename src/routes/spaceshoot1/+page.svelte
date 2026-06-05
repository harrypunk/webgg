<script lang="ts">
	import { Engine } from '@babylonjs/core/Engines/engine';
	import { Scene } from '@babylonjs/core/scene';
	import BabylonCanvas from '$lib/babylon/BabylonCanvas.svelte';
	import { Game, createBaseScene } from '$lib/babylon/spaceshoot1/game';

	function createScene(engine: Engine): Scene {
		const scene = new Scene(engine);
		createBaseScene(scene);

		const game = new Game(scene);
		scene.registerBeforeRender(() => {
			game.update(engine.getDeltaTime() / 1000);
		});

		return scene;
	}
</script>

<section class="page">
	<h1>Space Shoot 1</h1>
	<BabylonCanvas {createScene} />
</section>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 {
		font-size: 1.75rem;
		color: #ffff00;
		text-shadow: 0 0 8px #ffff00;
	}
</style>
