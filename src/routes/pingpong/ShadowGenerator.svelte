<script lang="ts">
	import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import type { Nullable } from '@babylonjs/core/types';
	import type { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
	import { getSceneContext } from './context';

	interface Props {
		mapSize?: number;
		light: Nullable<DirectionalLight>;
		shadowGenerator?: Nullable<ShadowGenerator>;
	}

	let {
		mapSize = 2048,
		light,
		// eslint-disable-next-line no-useless-assignment
		shadowGenerator = $bindable()
	}: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene || !light) return;

		const sg = new ShadowGenerator(mapSize, light);
		sg.useBlurExponentialShadowMap = true;
		sg.blurKernel = 64;
		sg.darkness = 0.4;
		shadowGenerator = sg;

		return () => {
			shadowGenerator = null;
			sg.dispose();
		};
	});
</script>
