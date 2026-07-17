<script lang="ts">
	import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
	import { Camera } from '@babylonjs/core/Cameras/camera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		position?: Vector3;
		target?: Vector3;
		worldHeight?: number;
	}

	let {
		name = 'orthographicCamera',
		position = new Vector3(0, 0, -10),
		target = Vector3.Zero(),
		worldHeight = 10
	}: Props = $props();

	const sceneCtx = getSceneContext();
	let camera = $state<Nullable<UniversalCamera>>(null);

	function updateBounds() {
		if (!camera) return;
		const engine = camera.getEngine();
		const aspect = engine.getRenderWidth() / engine.getRenderHeight();
		camera.orthoTop = worldHeight / 2;
		camera.orthoBottom = -worldHeight / 2;
		camera.orthoLeft = (-worldHeight / 2) * aspect;
		camera.orthoRight = (worldHeight / 2) * aspect;
	}

	// Creation effect: reads only the scene context and the create-only `name`
	// prop — changing `name` rebuilds the camera.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		const cam = new UniversalCamera(name, Vector3.Zero(), scene);
		cam.mode = Camera.ORTHOGRAPHIC_CAMERA;
		camera = cam;

		const engine = scene.getEngine();
		const resizeObserver = engine.onResizeObservable.add(updateBounds);

		return () => {
			engine.onResizeObservable.remove(resizeObserver);
			camera = null;
			cam.dispose();
		};
	});

	// Synced props: mutate the live camera in place — no rebuild.
	$effect(() => {
		if (!camera) return;
		camera.position.copyFrom(position);
		camera.setTarget(target.clone());
	});

	// Synced prop: recompute orthographic bounds when `worldHeight` changes.
	$effect(() => {
		updateBounds();
	});
</script>
