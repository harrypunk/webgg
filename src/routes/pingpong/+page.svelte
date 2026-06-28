<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Scene as BabylonScene } from '@babylonjs/core/scene';
	import type { DirectionalLight as DirLight } from '@babylonjs/core/Lights/directionalLight';
	import type { ShadowGenerator as ShadowGen } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import FullscreenButton from '$lib/components/FullscreenButton.svelte';
	import FullscreenIcon from '$lib/components/FullscreenIcon.svelte';
	import DebugButton from './DebugButton.svelte';
	import Camera from './Camera.svelte';
	import HemisphereLight from './HemisphereLight.svelte';
	import DirectionalLight from './DirectionalLight.svelte';
	import ShadowGenerator from './ShadowGenerator.svelte';
	import Ground from './Ground.svelte';
	import Walls from './Walls.svelte';
	import Paddle from './Paddle.svelte';
	import AxisGizmo from './AxisGizmo.svelte';

	const SCENE_CLEAR_COLOR = new Color4(0.12, 0.12, 0.12, 1);
	const CAMERA_POSITION = new Vector3(0, 8, -8);
	const CAMERA_TARGET = new Vector3(0, 0, 0);
	const LIGHT_DIFFUSE = new Color3(1, 1, 1);
	const GROUND_COLOR = new Color3(0.2, 0.2, 0.2);
	const DIRECTIONAL_DIRECTION = new Vector3(0, -1, 0.3);
	const DIRECTIONAL_POSITION = new Vector3(0, 10, -6);
	const DIRECTIONAL_DIFFUSE = new Color3(1, 0.95, 0.85);

	let scene = $state<Nullable<BabylonScene>>(null);
	let light = $state<Nullable<DirLight>>(null);
	let shadowGenerator = $state<Nullable<ShadowGen>>(null);
	let debug = $state(false);
	let canvasElement = $state<HTMLElement>();
	const fullscreenController = createFullscreen(() => canvasElement);
</script>

<section class="page">
	<h1>Ping Pong</h1>
	<div class="canvas-layout">
		<div class="canvas-pane">
			<Canvas bind:element={canvasElement}>
				<Scene bind:scene clearColor={SCENE_CLEAR_COLOR}>
					<Camera position={CAMERA_POSITION} target={CAMERA_TARGET} interactive={debug} />
					<HemisphereLight intensity={0.4} diffuse={LIGHT_DIFFUSE} groundColor={GROUND_COLOR} />
					<DirectionalLight
						direction={DIRECTIONAL_DIRECTION}
						position={DIRECTIONAL_POSITION}
						intensity={0.8}
						diffuse={DIRECTIONAL_DIFFUSE}
						bind:light
					/>
					<ShadowGenerator {light} bind:shadowGenerator />
					<Ground />
					<Walls />
					<Paddle {shadowGenerator} />
					<AxisGizmo visible={debug} />
				</Scene>
				<FullscreenIcon {fullscreenController} />
			</Canvas>
		</div>
		<aside class="side-panel">
			<h2>Controls</h2>
			<DebugButton bind:debug />
			<FullscreenButton {fullscreenController} />
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
