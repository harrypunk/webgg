<script lang="ts">
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import ShapeScene from './ShapeScene.svelte';
</script>

<ShapeScene
	mesh={(scene) =>
		MeshBuilder.CreateCylinder(
			'cone',
			{ diameterTop: 0, diameterBottom: 2, height: 2, tessellation: 32 },
			scene
		)}
	clearColor={new Color4(0.1, 0.05, 0.05, 1)}
	color={new Color3(1, 0.8, 0.2)}
	rotationY={-0.01}
	rotationZ={0.005}
/>
