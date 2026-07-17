<script lang="ts">
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import type { Nullable } from '@babylonjs/core/types';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		direction?: Vector3;
		intensity?: number;
		diffuse?: Color3;
		groundColor?: Color3;
	}

	let {
		name = 'hemi',
		direction = new Vector3(0, 1, 0),
		intensity = 0.4,
		diffuse = new Color3(0.8, 0.85, 1),
		groundColor = new Color3(0.2, 0.2, 0.25)
	}: Props = $props();

	const sceneCtx = getSceneContext();
	let light = $state<Nullable<HemisphericLight>>(null);

	// Creation effect: reads only the scene context and the create-only `name`
	// prop — changing `name` rebuilds the light.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const l = new HemisphericLight(name, Vector3.Up(), sceneCtx.scene);
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
		light.intensity = intensity;
		light.diffuse = diffuse;
		light.groundColor = groundColor;
	});
</script>
