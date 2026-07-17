<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import type { Nullable } from '@babylonjs/core/types';
	import { getSceneContext } from '$lib/babylon/context';
	import type { Scene } from '@babylonjs/core/scene';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';

	interface Props {
		mesh: (scene: Scene) => Mesh;
		clearColor: Color4;
		color: Color3;
		rotationY?: number;
		rotationX?: number;
		rotationZ?: number;
	}

	let { mesh, clearColor, color, rotationY = 0, rotationX = 0, rotationZ = 0 }: Props = $props();

	const sceneCtx = getSceneContext();
	let mat = $state<Nullable<StandardMaterial>>(null);

	// Creation effect: `mesh` is a create-only factory prop — changing it
	// rebuilds the scene content.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;

		const canvas = scene.getEngine().getRenderingCanvas();
		const camera = new ArcRotateCamera(
			'cam',
			-Math.PI / 2,
			Math.PI / 2.5,
			8,
			Vector3.Zero(),
			scene
		);
		if (canvas) camera.attachControl(canvas, true);

		const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
		light.intensity = 0.7;

		const shape = mesh(scene);
		const material = new StandardMaterial('mat', scene);
		shape.material = material;
		mat = material;

		// rotationX/Y/Z are read per frame in this observer, so they stay live
		// without being tracked by the creation effect.
		const observer = scene.onBeforeRenderObservable.add(() => {
			shape.rotation.y += rotationY;
			shape.rotation.x += rotationX;
			shape.rotation.z += rotationZ;
		});

		return () => {
			scene.onBeforeRenderObservable.remove(observer);
			mat = null;
			camera.dispose();
			light.dispose();
			shape.dispose();
			material.dispose();
		};
	});

	// Synced props: mutate the live scene/material in place — no rebuild.
	$effect(() => {
		if (sceneCtx.scene) sceneCtx.scene.clearColor = clearColor;
		if (mat) mat.diffuseColor = color;
	});
</script>
