<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';
	import type { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import Canvas from '$lib/babylon/Canvas.svelte';
	import Scene from '$lib/babylon/Scene.svelte';
	import HemisphereLight from '$lib/babylon/HemisphereLight.svelte';
	import Camera from './Camera.svelte';
	import Grassland from './Grassland.svelte';
	import Character from './Character.svelte';

	// Bright midday sky.
	const SCENE_CLEAR_COLOR = new Color4(0.53, 0.81, 0.98, 1);
	const CAMERA_TARGET = new Vector3(0, 1, 0);
	const SKY_DIFFUSE = new Color3(0.9, 0.95, 1);
	// Green bounce light coming back up from the grass.
	const GROUND_BOUNCE = new Color3(0.3, 0.4, 0.2);

	let character = $state<Nullable<Mesh>>(null);
	let camera = $state<Nullable<ArcRotateCamera>>(null);
</script>

<section class="page">
	<h1>Farm Dungeon</h1>
	<div class="canvas-pane">
		<Canvas>
			<Scene clearColor={SCENE_CLEAR_COLOR}>
				<Camera target={CAMERA_TARGET} follow={character} bind:camera />
				<HemisphereLight intensity={0.9} diffuse={SKY_DIFFUSE} groundColor={GROUND_BOUNCE} />
				<Grassland />
				<Character bind:mesh={character} {camera} />
			</Scene>
		</Canvas>
	</div>
</section>
