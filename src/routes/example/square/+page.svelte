<script lang="ts">
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import ClearColor from '$lib/babylon/ClearColor.svelte';
	import OrthographicCamera from '$lib/babylon/OrthographicCamera.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import { PannedCamera } from '$lib/babylon/pannedCamera.svelte.js';
	import { createMiddleMousePan } from '$lib/attachments/middleMousePan.svelte.js';
	import GameLayout from '$lib/components/GameLayout.svelte';
	import Grid from './Grid.svelte';
	import Square from './Square.svelte';
	import CameraTools from './CameraTools.svelte';

	// Matches the grid's main color so the background blends seamlessly.
	const CLEAR_COLOR = new Color4(0.16, 0.16, 0.22, 1);
	const WORLD_HEIGHT = 10;

	let scene = $state<Nullable<BabylonScene>>(null);
	let canvasElement = $state<HTMLElement>();

	const camera = new PannedCamera(WORLD_HEIGHT, () => scene?.getEngine().getRenderHeight() ?? 0);
	createMiddleMousePan(() => canvasElement, camera.panPixels);
</script>

<GameLayout title="Square">
	<Canvas bind:element={canvasElement}>
		<Scene bind:scene>
			<ClearColor color={CLEAR_COLOR} />
			<OrthographicCamera
				position={camera.position}
				target={camera.target}
				worldHeight={WORLD_HEIGHT}
			/>
			<HemisphereLight intensity={0.9} />
			<Grid />
			<Square />
		</Scene>
	</Canvas>
	{#snippet panel()}
		<h2>Controls</h2>
		<p>
			Move with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> · Pan: middle-mouse drag
		</p>
		<CameraTools position={camera.position} onPan={camera.pan} />
	{/snippet}
</GameLayout>
