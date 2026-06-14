<script lang="ts">
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import ShapeScene from './ShapeScene.svelte';
</script>

<ShapeScene
	mesh={(scene) => MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene)}
	clearColor={new Color4(0.05, 0.1, 0.05, 1)}
	color={new Color3(0.2, 0.4, 1)}
	rotationY={0.01}
/>
