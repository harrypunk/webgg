<script lang="ts">
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import { getEngineContext, getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		alpha?: number;
		beta?: number;
		radius?: number;
		target?: Vector3;
	}

	let {
		name = 'camera',
		alpha = -Math.PI / 2,
		beta = Math.PI / 3.5,
		radius = 14,
		target = Vector3.Zero()
	}: Props = $props();

	const sceneCtx = getSceneContext();
	const engineCtx = getEngineContext();
	let camera = $state<Nullable<ArcRotateCamera>>(null);

	// Creation effect: reads only contexts and the create-only `name` prop —
	// changing `name` rebuilds the camera.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cam = new ArcRotateCamera(name, 0, 0, 10, Vector3.Zero(), sceneCtx.scene);
		camera = cam;

		return () => {
			cam.detachControl();
			cam.dispose();
			camera = null;
		};
	});

	// Synced props: mutate the live camera in place — no rebuild.
	$effect(() => {
		if (!camera) return;
		camera.alpha = alpha;
		camera.beta = beta;
		camera.radius = radius;
		camera.target = target;
	});

	// Attach orbit controls once camera and canvas are both available.
	$effect(() => {
		if (!camera || !engineCtx.canvas) return;
		camera.attachControl(engineCtx.canvas, true);
	});
</script>
