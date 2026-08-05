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
		light = $bindable()
	}: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect: reads only the scene context and the create-only `name`
	// prop — changing `name` rebuilds the light.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const l = new DirectionalLight(name, Vector3.Down(), sceneCtx.scene);
		light = l;

		return () => {
			light = null;
			l.dispose();
		};
	});

	// Synced props: mutate the live light in place — no rebuild.
	$effect(() => {
		if (!light) return;
		light.direction.copyFrom(direction);
		light.position.copyFrom(position);
		light.intensity = intensity;
		light.diffuse = diffuse;
	});
</script>
