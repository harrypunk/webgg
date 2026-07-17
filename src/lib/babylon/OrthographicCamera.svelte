<script lang="ts">
	import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
	import { Camera } from '@babylonjs/core/Cameras/camera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import { untrack } from 'svelte';
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

	// Creation effect: reads only the scene context and the create-only `name`
	// prop — changing `name` rebuilds the camera.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		const cam = new UniversalCamera(name, Vector3.Zero(), scene);
		cam.mode = Camera.ORTHOGRAPHIC_CAMERA;
		camera = cam;

		// Derive the ortho frustum from the live viewport every frame: the view
		// always shows exactly `worldHeight` world units vertically and whatever
		// fits horizontally. Unlike perspective cameras, Babylon does not
		// auto-adapt ortho bounds to the render size, so something must map
		// viewport → frustum. Doing it per frame keeps the camera correct on
		// window resize, fullscreen and zoom with no resize-event wiring.
		// Babylon skips the projection recompute when the derived values have
		// not changed, so unchanged frames are free.
		const updateBounds = () => {
			const engine = scene.getEngine();
			const aspect = engine.getRenderWidth() / engine.getRenderHeight();
			cam.orthoTop = worldHeight / 2;
			cam.orthoBottom = -worldHeight / 2;
			cam.orthoLeft = (-worldHeight / 2) * aspect;
			cam.orthoRight = (worldHeight / 2) * aspect;
		};
		// Apply once immediately; `untrack` keeps the per-frame `worldHeight`
		// read inside `updateBounds` from being tracked by this effect.
		untrack(updateBounds);
		const boundsObserver = scene.onBeforeRenderObservable.add(updateBounds);

		return () => {
			scene.onBeforeRenderObservable.remove(boundsObserver);
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
</script>
