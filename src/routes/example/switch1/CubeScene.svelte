<script lang="ts">
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import ShapeScene from './ShapeScene.svelte';
</script>

<ShapeScene
	mesh={(scene) => MeshBuilder.CreateBox('box', { size: 2 }, scene)}
	clearColor={new Color4(0.05, 0.05, 0.1, 1)}
	color={new Color3(1, 0.2, 0.2)}
	rotationY={0.01}
	rotationX={0.005}
/>
