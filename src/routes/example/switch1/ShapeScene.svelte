<script lang="ts">
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
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

	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		scene.clearColor = clearColor;

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
		const mat = new StandardMaterial('mat', scene);
		mat.diffuseColor = color;
		shape.material = mat;

		const observer = scene.onBeforeRenderObservable.add(() => {
			shape.rotation.y += rotationY;
			shape.rotation.x += rotationX;
			shape.rotation.z += rotationZ;
		});

		return () => {
			scene.onBeforeRenderObservable.remove(observer);
			camera.dispose();
			light.dispose();
			shape.dispose();
			mat.dispose();
		};
	});
</script>
