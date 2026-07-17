<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		size?: number;
		cellSize?: number;
		majorEvery?: number;
		mainColor?: Color3;
		lineColor?: Color3;
	}

	let {
		name = 'grid',
		size = 500,
		cellSize = 1,
		majorEvery = 5,
		mainColor = new Color3(0.16, 0.16, 0.22),
		lineColor = new Color3(0.55, 0.6, 0.75)
	}: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect only: all props are create-only — changing them rebuilds
	// the grid.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const grid = MeshBuilder.CreatePlane(name, { size }, sceneCtx.scene);
		// Sit slightly behind the action plane (z=0) so actors always draw on top.
		grid.position.z = 0.5;

		const mat = new GridMaterial(`${name}Mat`, sceneCtx.scene);
		mat.gridRatio = cellSize;
		mat.majorUnitFrequency = majorEvery;
		mat.minorUnitVisibility = 0.35;
		mat.mainColor = mainColor;
		mat.lineColor = lineColor;
		// Draw regardless of which way the plane faces.
		mat.backFaceCulling = false;
		grid.material = mat;

		return () => {
			grid.dispose();
			mat.dispose();
		};
	});
</script>
