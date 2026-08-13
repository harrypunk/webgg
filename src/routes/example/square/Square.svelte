<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import { getEngineContext, getSceneContext } from '$lib/babylon/context';
	import { useMovement } from '$lib/babylon/useMovement';
	import { createGameInputSources } from '$lib/babylon/gameInput';

	// This 2D scene lives on the XY plane: screen up is +y, screen right +x.
	const FRONT_AXIS = new Vector3(0, 1, 0);
	const RIGHT_AXIS = new Vector3(1, 0, 0);

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
		color = new Color3(1, 0, 1),
		speed = 6,
		y = -3
	}: Props = $props();

	const sceneCtx = getSceneContext();
	const engineCtx = getEngineContext();
	let mat = $state<Nullable<StandardMaterial>>(null);

	// Creation effect: `name`, `size` and `y` are create-only — changing them
	// rebuilds the mesh. `speed` is passed as a getter so it is read live every
	// frame instead of being tracked by this effect.
	$effect(() => {
		const scene = sceneCtx.scene;
		const canvas = engineCtx.canvas;
		if (!scene || !canvas) return;

		const square = MeshBuilder.CreatePlane(name, { size }, scene);
		square.position.y = y;

		const material = new StandardMaterial(`${name}Mat`, scene);
		material.disableLighting = true;
		square.material = material;
		mat = material;

		const detachMovement = useMovement(scene, {
			speed: () => speed,
			frontAxis: () => FRONT_AXIS,
			rightAxis: () => RIGHT_AXIS,
			sources: createGameInputSources(canvas),
			onMove: (d) => square.position.addInPlace(d)
		});

		return () => {
			detachMovement();
			mat = null;
			square.dispose();
			material.dispose();
		};
	});

	// Synced prop: recolor the live material in place — no rebuild.
	// Emissive matches diffuse so the square stays vivid regardless of lighting.
	$effect(() => {
		if (!mat) return;
		mat.diffuseColor = color;
		mat.emissiveColor = color;
	});
</script>
