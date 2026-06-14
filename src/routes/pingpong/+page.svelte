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
	import AxisGizmo from './AxisGizmo.svelte';

	let scene = $state<Nullable<BabylonScene>>(null);
	let light = $state<Nullable<DirLight>>(null);
	let shadowGenerator = $state<Nullable<ShadowGen>>(null);
	let debug = $state(false);
</script>

<section class="page">
	<h1>Ping Pong</h1>
	<div class="canvas-layout">
		<div class="canvas-pane">
			<Canvas>
				<Scene bind:scene>
					<Camera position={new Vector3(0, 8, -8)} target={Vector3.Zero()} />
					<HemisphereLight
						diffuse={new Color3(0.8, 0.85, 1)}
						groundColor={new Color3(0.2, 0.2, 0.25)}
					/>
					<DirectionalLight
						direction={new Vector3(0, -1, 0.3)}
						position={new Vector3(0, 10, -6)}
						intensity={1.2}
						diffuse={new Color3(1, 0.95, 0.85)}
						bind:light
					/>
					<ShadowGenerator {light} bind:shadowGenerator />
					<Ground />
					<Paddle {shadowGenerator} />
					<AxisGizmo visible={debug} />
				</Scene>
			</Canvas>
		</div>
		<aside class="side-panel">
			<h2>Controls</h2>
			<button class="debug-btn" onclick={() => (debug = !debug)}>
				Debug: {debug ? 'ON' : 'OFF'}
			</button>
		</aside>
	</div>
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

	.canvas-layout {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		overflow: hidden;
	}

	.canvas-pane {
		flex: 1;
		min-width: 0;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.side-panel {
		width: 220px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: #000;
		border: 2px solid #00ff41;
		box-shadow: 0 0 12px #00ff41;
		overflow-y: auto;
	}

	.side-panel h2 {
		font-size: 1rem;
		color: #00ff41;
		text-shadow: 0 0 4px #00ff41;
		margin: 0;
	}

	.debug-btn {
		padding: 0.5rem 1rem;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		color: #00ff41;
		background: #000;
		border: 2px solid #00ff41;
		box-shadow: 0 0 8px #00ff41;
		cursor: pointer;
	}

	.debug-btn:hover {
		color: #000;
		background: #00ff41;
	}
</style>
