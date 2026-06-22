<script lang="ts">
	import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
	import type { Nullable } from '@babylonjs/core/types';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		direction?: Vector3;
		position?: Vector3;
		intensity?: number;
		diffuse?: Color3;
		light?: Nullable<DirectionalLight>;
	}

	let {
		name = 'dir',
		direction = new Vector3(-1, -0.3, 0.5),
		position = new Vector3(5, 8, -5),
		intensity = 0.8,
		diffuse = new Color3(1, 0.95, 0.85),
		// eslint-disable-next-line no-useless-assignment
		light = $bindable()
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const l = new DirectionalLight(name, direction, sceneCtx.scene);
		l.position = position;
		l.intensity = intensity;
		l.diffuse = diffuse;
		light = l;

		return () => {
			light = null;
			l.dispose();
		};
	});
</script>
