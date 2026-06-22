<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';
	import { useMovement } from './useMovement';

	interface Props {
		name?: string;
		width?: number;
		height?: number;
		depth?: number;
		startX?: number;
		startZ?: number;
		speed?: number;
	}

	let {
		name = 'paddle',
		width = 1.5,
		height = 0.15,
		depth = 0.25,
		startX = 0,
		startZ = -4,
		speed = 6
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const paddle = MeshBuilder.CreateBox(name, { width, height, depth }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(1, 1, 1);
		mat.specularColor = new Color3(0.2, 0.2, 0.2);
		paddle.material = mat;
		paddle.position.x = startX;
		paddle.position.z = startZ;
		paddle.position.y = height / 2;

		const detachMovement = useMovement(sceneCtx.scene, paddle, { speed });

		return () => {
			detachMovement();
			paddle.dispose();
			mat.dispose();
		};
	});
</script>
