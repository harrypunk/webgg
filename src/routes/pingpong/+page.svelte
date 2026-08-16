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
	import ClearColor from '$lib/babylon/ClearColor.svelte';
	import GameLayout from '$lib/components/GameLayout.svelte';
	import DebugButton from './DebugButton.svelte';
	import Camera from './Camera.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import DirectionalLight from '$lib/babylon/DirectionalLight.svelte';
	import ShadowGenerator from '$lib/babylon/ShadowGenerator.svelte';
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
</script>

<GameLayout title="Ping Pong">
	<Canvas>
		<Scene bind:scene>
			<ClearColor color={SCENE_CLEAR_COLOR} />
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
	</Canvas>
	{#snippet panel()}
		<h2>Controls</h2>
		<DebugButton bind:debug />
	{/snippet}
</GameLayout>
