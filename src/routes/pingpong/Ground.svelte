<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		width?: number;
		height?: number;
		diffuseColor?: Color3;
		specularColor?: Color3;
	}

	let {
		name = 'ground',
		width = 6,
		height = 10,
		diffuseColor = new Color3(0.18, 0.42, 0.18),
		specularColor = new Color3(0.1, 0.1, 0.1)
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const ground = MeshBuilder.CreateGround(name, { width, height }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = diffuseColor;
		mat.specularColor = specularColor;
		ground.material = mat;
		ground.receiveShadows = true;

		return () => {
			ground.dispose();
			mat.dispose();
		};
	});
</script>
