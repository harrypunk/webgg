<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		width?: number;
		height?: number;
		gridColor?: Color3;
		gridRatio?: number;
	}

	let {
		name = 'ground',
		width = 8,
		height = 14,
		gridColor = new Color3(1, 0.75, 0.15),
		gridRatio = 1
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;

		// Dark floor plane.
		const ground = MeshBuilder.CreateGround(name, { width, height }, scene);
		const floorMat = new StandardMaterial(`${name}FloorMat`, scene);
		floorMat.diffuseColor = new Color3(0.02, 0.02, 0.03);
		floorMat.specularColor = new Color3(0.05, 0.05, 0.05);
		ground.material = floorMat;
		ground.receiveShadows = true;

		// Golden glowing grid lines just above the floor to avoid z-fighting.
		const halfW = width / 2;
		const halfH = height / 2;
		const y = 0.01;
		const lines: Vector3[][] = [];

		for (let x = -halfW; x <= halfW + 0.001; x += gridRatio) {
			lines.push([new Vector3(x, y, -halfH), new Vector3(x, y, halfH)]);
		}
		for (let z = -halfH; z <= halfH + 0.001; z += gridRatio) {
			lines.push([new Vector3(-halfW, y, z), new Vector3(halfW, y, z)]);
		}

		const grid = MeshBuilder.CreateLineSystem(`${name}Grid`, { lines }, scene);
		const gridMat = new StandardMaterial(`${name}GridMat`, scene);
		gridMat.emissiveColor = gridColor;
		gridMat.disableLighting = true;
		grid.material = gridMat;

		return () => {
			ground.dispose();
			floorMat.dispose();
			grid.dispose();
			gridMat.dispose();
		};
	});
</script>
