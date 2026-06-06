<script lang="ts">
	import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from './context';

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

	$effect(() => {
		if (!sceneCtx.scene) return;

		const light = new HemisphericLight(name, direction, sceneCtx.scene);
		light.intensity = intensity;
		light.diffuse = diffuse;
		light.groundColor = groundColor;

		return () => {
			light.dispose();
		};
	});
</script>
