<script lang="ts">
	import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import { getEngineContext, getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		position?: Vector3;
		target?: Vector3;
		interactive?: boolean;
	}

	let {
		name = 'camera',
		position = new Vector3(0, 8, -8),
		target = Vector3.Zero(),
		interactive = true
	}: Props = $props();

	const sceneCtx = getSceneContext();
	const engineCtx = getEngineContext();

	// Reactive reference so effects that depend on the camera instance rerun
	// when a new camera is created (e.g. on scene change).
	let camera = $state<Nullable<UniversalCamera>>(null);

	// Creation effect: reads only contexts and the create-only `name` prop —
	// changing `name` rebuilds the camera.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cam = new UniversalCamera(name, Vector3.Zero(), sceneCtx.scene);
		camera = cam;

		return () => {
			cam.detachControl();
			cam.dispose();
			camera = null;
		};
	});

	// Synced props: place the live camera in place — no rebuild.
	$effect(() => {
		if (!camera) return;
		camera.position.copyFrom(position);
		camera.setTarget(target.clone());
	});

	// Synced prop: attach/detach input controls based on the interactive prop.
	// When interactivity is disabled, snap the camera back to the prop pose.
	$effect(() => {
		if (!camera || !engineCtx.canvas) return;

		if (interactive) {
			camera.attachControl(engineCtx.canvas, true);
		} else {
			camera.detachControl();
			camera.position.copyFrom(position);
			camera.setTarget(target.clone());
		}
	});
</script>
