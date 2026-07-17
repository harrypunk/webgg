<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import { getSceneContext } from '$lib/babylon/context';
	import { useMovement } from '$lib/babylon/useMovement';

	interface Props {
		name?: string;
		size?: number;
		color?: Color3;
		speed?: number;
		y?: number;
	}

	let {
		name = 'square',
		size = 1,
		color = new Color3(0, 1, 0.25),
		speed = 6,
		y = -3
	}: Props = $props();

	const sceneCtx = getSceneContext();
	let mat = $state<Nullable<StandardMaterial>>(null);

	// Creation effect: `name`, `size` and `y` are create-only — changing them
	// rebuilds the mesh. `speed` is passed as a getter so it is read live every
	// frame instead of being tracked by this effect.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const square = MeshBuilder.CreatePlane(name, { size }, sceneCtx.scene);
		square.position.y = y;

		const material = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		material.disableLighting = true;
		square.material = material;
		mat = material;

		const detachMovement = useMovement(sceneCtx.scene, square, { speed: () => speed });

		return () => {
			detachMovement();
			mat = null;
			square.dispose();
			material.dispose();
		};
	});

	// Synced prop: recolor the live material in place — no rebuild.
	$effect(() => {
		if (!mat) return;
		mat.diffuseColor = color;
	});
</script>
