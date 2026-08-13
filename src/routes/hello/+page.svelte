<script lang="ts">
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import GameLayout from '$lib/components/GameLayout.svelte';
	import HelloScene from './HelloScene.svelte';

	let scene = $state<Nullable<BabylonScene>>(null);
</script>

<GameLayout title="Hello Babylon">
	<Canvas>
		<Scene bind:scene>
			<HelloScene />
		</Scene>
	</Canvas>
</GameLayout>
