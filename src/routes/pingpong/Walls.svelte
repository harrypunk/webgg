<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Material } from '@babylonjs/core/Materials/material';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';
	import '@babylonjs/core/Rendering/edgesRenderer';
	import { COURT_DEPTH, COURT_WIDTH } from './court';

	interface Props {
		name?: string;
		width?: number;
		depth?: number;
		height?: number;
		thickness?: number;
	}

	let {
		name = 'wall',
		width = COURT_WIDTH,
		depth = COURT_DEPTH,
		height = 1,
		thickness = 0.2
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const halfW = width / 2;
		const halfD = depth / 2;
		const y = height / 2;

		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(1, 1, 1);
		mat.emissiveColor = new Color3(0.2, 0.2, 0.2);
		mat.specularColor = new Color3(0.1, 0.1, 0.1);
		mat.disableLighting = true;
		mat.alpha = 0.12;
		mat.transparencyMode = Material.MATERIAL_ALPHABLEND;
		mat.backFaceCulling = false;

		const left = MeshBuilder.CreateBox(
			`${name}-left`,
			{ width: thickness, height, depth },
			sceneCtx.scene
		);
		const right = MeshBuilder.CreateBox(
			`${name}-right`,
			{ width: thickness, height, depth },
			sceneCtx.scene
		);
		// Keep end walls inside the side walls so the transparent panels don't overlap.
		const far = MeshBuilder.CreateBox(
			`${name}-far`,
			{ width, height, depth: thickness },
			sceneCtx.scene
		);
		const near = MeshBuilder.CreateBox(
			`${name}-near`,
			{ width, height, depth: thickness },
			sceneCtx.scene
		);

		left.position.set(-(halfW + thickness / 2), y, 0);
		right.position.set(halfW + thickness / 2, y, 0);
		far.position.set(0, y, -(halfD + thickness / 2));
		near.position.set(0, y, halfD + thickness / 2);

		const walls = [left, right, far, near];
		walls.forEach((wall) => {
			wall.material = mat;
			wall.receiveShadows = true;
			wall.checkCollisions = true;
			wall.enableEdgesRendering();
			wall.edgesWidth = 4.0;
			wall.edgesColor = new Color4(1, 1, 1, 0.8);
		});

		return () => {
			walls.forEach((wall) => wall.dispose());
			mat.dispose();
		};
	});
</script>
