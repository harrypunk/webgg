<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import type { DirectionalLight as DirLight } from '@babylonjs/core/Lights/directionalLight';
	import type { ShadowGenerator as ShadowGen } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import Camera from './Camera.svelte';
	import HemisphereLight from './HemisphereLight.svelte';
	import DirectionalLight from './DirectionalLight.svelte';
	import ShadowGenerator from './ShadowGenerator.svelte';
	import Ground from './Ground.svelte';
	import Paddle from './Paddle.svelte';

	let scene = $state<Nullable<BabylonScene>>(null);
	let light = $state<Nullable<DirLight>>(null);
	let shadowGenerator = $state<Nullable<ShadowGen>>(null);
</script>

<section class="page">
	<h1>Ping Pong</h1>
	<Canvas>
		<Scene bind:scene>
			<Camera position={new Vector3(0, 8, -8)} target={Vector3.Zero()} />
			<HemisphereLight
				diffuse={new Color3(0.8, 0.85, 1)}
				groundColor={new Color3(0.2, 0.2, 0.25)}
			/>
			<DirectionalLight
				direction={new Vector3(-1, -0.3, 0.5)}
				position={new Vector3(5, 8, -5)}
				intensity={1.2}
				diffuse={new Color3(1, 0.95, 0.85)}
				bind:light
			/>
			<ShadowGenerator {light} bind:shadowGenerator />
			<Ground />
			<Paddle {shadowGenerator} />
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
