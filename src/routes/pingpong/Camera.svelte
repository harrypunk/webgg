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

	// Effect 1: create the camera once the scene exists. It does not attach
	// controls because that is handled reactively by effect 2.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cam = new UniversalCamera(name, position.clone(), sceneCtx.scene);
		cam.setTarget(target.clone());
		camera = cam;

		return () => {
			cam.detachControl();
			cam.dispose();
			camera = null;
		};
	});

	// Effect 2: attach/detach input controls based on the interactive prop.
	// When interactivity is disabled, snap the camera back to its initial angle.
	$effect(() => {
		if (!camera || !engineCtx.canvas) return;

		if (interactive) {
			camera.attachControl(engineCtx.canvas, true);
		} else {
			camera.detachControl();
			camera.position = position.clone();
			camera.setTarget(target.clone());
		}
	});
</script>
