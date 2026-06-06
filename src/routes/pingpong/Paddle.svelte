<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import { getSceneContext } from './context';

	interface Props {
		name?: string;
		width?: number;
		height?: number;
		depth?: number;
		startX?: number;
		startZ?: number;
		speed?: number;
		diffuseColor?: Color3;
		specularColor?: Color3;
		ambientColor?: Color3;
		shadowGenerator?: Nullable<ShadowGenerator>;
	}

	let {
		name = 'paddle',
		width = 1.5,
		height = 0.15,
		depth = 0.25,
		startX = 0,
		startZ = -4,
		speed = 6,
		diffuseColor = new Color3(0.55, 0.55, 0.55),
		specularColor = new Color3(0.3, 0.3, 0.3),
		ambientColor = new Color3(0.4, 0.4, 0.4),
		shadowGenerator
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const paddle = MeshBuilder.CreateBox(name, { width, height, depth }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = diffuseColor;
		mat.specularColor = specularColor;
		mat.ambientColor = ambientColor;
		paddle.material = mat;
		paddle.position.x = startX;
		paddle.position.z = startZ;
		paddle.position.y = 0.5;

		if (shadowGenerator) {
			shadowGenerator.addShadowCaster(paddle);
		}

		const input = { a: false, d: false };

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'KeyA') input.a = true;
			if (e.code === 'KeyD') input.d = true;
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'KeyA') input.a = false;
			if (e.code === 'KeyD') input.d = false;
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		const observer = sceneCtx.scene.onBeforeRenderObservable.add(() => {
			const dt = sceneCtx.scene!.getEngine().getDeltaTime() / 1000;
			if (input.a) paddle.position.x -= speed * dt;
			if (input.d) paddle.position.x += speed * dt;
		});

		return () => {
			sceneCtx.scene?.onBeforeRenderObservable.remove(observer);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			paddle.dispose();
			mat.dispose();
		};
	});
</script>
