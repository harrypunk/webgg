<script lang="ts">
	import type { Color4 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from './context';

	interface Props {
		color: Color4;
	}

	let { color }: Props = $props();

	const sceneCtx = getSceneContext();

	// Synced prop: mutate the live scene in place — no rebuild.
	$effect(() => {
		if (!sceneCtx.scene) return;
		sceneCtx.scene.clearColor = color;
	});
</script>
