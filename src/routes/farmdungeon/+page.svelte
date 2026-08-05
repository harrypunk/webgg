<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';
	import type { DirectionalLight as DirLight } from '@babylonjs/core/Lights/directionalLight';
	import type { ShadowGenerator as ShadowGen } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import DirectionalLight from '$lib/babylon/DirectionalLight.svelte';
	import ShadowGenerator from '$lib/babylon/ShadowGenerator.svelte';
	import Camera from './Camera.svelte';
	import Grassland from './Grassland.svelte';
	import Character from './Character.svelte';
	import AxisReadout from './AxisReadout.svelte';
	import { createViewAxis } from './viewAxis';

	// Bright midday sky.
	const SCENE_CLEAR_COLOR = new Color4(0.53, 0.81, 0.98, 1);
	const CAMERA_TARGET = new Vector3(0, 1, 0);
	const SKY_DIFFUSE = new Color3(0.9, 0.95, 1);
	// Green bounce light coming back up from the grass.
	const GROUND_BOUNCE = new Color3(0.3, 0.4, 0.2);
	// Warm midday sun, high and slightly off-axis so shadows read on the grass.
	const SUN_POSITION = new Vector3(8, 16, 6);
	const SUN_DIRECTION = new Vector3(-8, -16, -6).normalize();
	const SUN_DIFFUSE = new Color3(1, 0.98, 0.9);

	// Shared axis: the camera publishes its view forward, the character reads
	// it to steer WASD movement.
	const viewAxis = createViewAxis();

	let character = $state<Nullable<Mesh>>(null);
	let sun = $state<Nullable<DirLight>>(null);
	let shadowGenerator = $state<Nullable<ShadowGen>>(null);
</script>

<section class="page">
	<h1>Farm Dungeon</h1>
	<div class="canvas-layout">
		<div class="canvas-pane">
			<Canvas>
				<Scene clearColor={SCENE_CLEAR_COLOR}>
					<Camera target={CAMERA_TARGET} follow={character} axis={viewAxis} />
					<HemisphereLight intensity={0.6} diffuse={SKY_DIFFUSE} groundColor={GROUND_BOUNCE} />
					<DirectionalLight
						direction={SUN_DIRECTION}
						position={SUN_POSITION}
						intensity={0.9}
						diffuse={SUN_DIFFUSE}
						bind:light={sun}
					/>
					<ShadowGenerator light={sun} bind:shadowGenerator />
					<Grassland />
					<Character bind:mesh={character} axis={viewAxis} {shadowGenerator} />
				</Scene>
			</Canvas>
		</div>
		<aside class="side-panel">
			<h2>Debug</h2>
			<AxisReadout axis={viewAxis} />
		</aside>
	</div>
</section>

<style>
	.canvas-layout {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		overflow: hidden;
	}

	.side-panel {
		width: 220px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		box-shadow: var(--glow-primary-lg);
		overflow-y: auto;
	}

	.side-panel h2 {
		font-size: 1rem;
		color: var(--color-primary);
		text-shadow: var(--glow-primary-sm);
		margin: 0;
	}
</style>
