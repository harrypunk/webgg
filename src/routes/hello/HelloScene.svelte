<script lang="ts">
	import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { getSceneContext } from '$lib/babylon/context';

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

		const canvas = scene.getEngine().getRenderingCanvas();
		const camera = new ArcRotateCamera(
			'camera1',
			-Math.PI / 2,
			Math.PI / 2.5,
			10,
			Vector3.Zero(),
			scene
		);
		if (canvas) camera.attachControl(canvas, true);

		const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
		light.intensity = 0.7;

		const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);
		sphere.position.y = 1;

		const sphereMat = new StandardMaterial('sphereMat', scene);
		sphereMat.diffuseColor = new Color3(1, 0.2, 0.2);
		sphere.material = sphereMat;

		const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

		const groundMat = new StandardMaterial('groundMat', scene);
		groundMat.diffuseColor = new Color3(0.3, 0.5, 0.3);
		ground.material = groundMat;

		const observer = scene.onBeforeRenderObservable.add(() => {
			sphere.rotation.y += 0.01;
		});

		return () => {
			scene.onBeforeRenderObservable.remove(observer);
			camera.dispose();
			light.dispose();
			sphere.dispose();
			sphereMat.dispose();
			ground.dispose();
			groundMat.dispose();
		};
	});
</script>
