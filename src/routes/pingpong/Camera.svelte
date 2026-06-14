<script lang="ts">
	import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { getEngineContext, getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		position?: Vector3;
		target?: Vector3;
	}

	let {
		name = 'camera',
		position = new Vector3(0, 8, -8),
		target = Vector3.Zero()
	}: Props = $props();

	const sceneCtx = getSceneContext();
	const engineCtx = getEngineContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const camera = new UniversalCamera(name, position, sceneCtx.scene);
		camera.setTarget(target);

		// Attach mouse/touch controls so the user can rotate/zoom the view.
		// The canvas comes from the engine context set up by Canvas.svelte.
		const canvas = engineCtx.canvas;
		if (canvas) {
			camera.attachControl(canvas, true);
		}

		return () => {
			camera.detachControl();
			camera.dispose();
		};
	});
</script>
