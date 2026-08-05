<script lang="ts">
	import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
	import { getEngineContext, getSceneContext } from '$lib/babylon/context';
	import type { ViewAxis } from './viewAxis';

	interface Props {
		name?: string;
		alpha?: number;
		beta?: number;
		radius?: number;
		target?: Vector3;
		/** When set, the camera keeps this mesh centered as it moves. */
		follow?: Nullable<AbstractMesh>;
		/** When set, the camera publishes its ground-projected forward here. */
		axis?: Nullable<ViewAxis>;
	}

	let {
		name = 'camera',
		alpha = -Math.PI / 2,
		beta = Math.PI / 3.5,
		radius = 14,
		target = Vector3.Zero(),
		follow = null,
		axis = null
	}: Props = $props();

	const sceneCtx = getSceneContext();
	const engineCtx = getEngineContext();
	let camera = $state<Nullable<ArcRotateCamera>>(null);

	// Creation effect: reads only contexts and the create-only `name` prop —
	// changing `name` rebuilds the camera.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cam = new ArcRotateCamera(name, 0, 0, 10, Vector3.Zero(), sceneCtx.scene);
		// WoW-style orbit: dragging always rotates around the target, never pans.
		cam.panningSensibility = 0;
		// Clamp zoom and keep the camera above the grass.
		cam.lowerRadiusLimit = 4;
		cam.upperRadiusLimit = 25;
		cam.lowerBetaLimit = 0.15;
		cam.upperBetaLimit = Math.PI / 2 - 0.05;
		camera = cam;

		return () => {
			cam.detachControl();
			cam.dispose();
			camera = null;
		};
	});

	// Synced props: mutate the live camera in place — no rebuild. While
	// following a mesh, the per-frame observer below owns the target.
	$effect(() => {
		if (!camera) return;
		camera.alpha = alpha;
		camera.beta = beta;
		camera.radius = radius;
		if (!follow) camera.target = target;
	});

	// Follow subscription: re-center the orbit target on the followed mesh
	// every frame (aimed at its torso), with cleanup on change or teardown.
	$effect(() => {
		const scene = sceneCtx.scene;
		const cam = camera;
		const mesh = follow;
		if (!cam || !scene || !mesh) return;
		const observer = scene.onBeforeRenderObservable.add(() => {
			cam.target.set(mesh.position.x, mesh.position.y + 0.5, mesh.position.z);
		});
		return () => {
			scene.onBeforeRenderObservable.remove(observer);
		};
	});

	// Axis publisher: write the ground-projected view forward into the shared
	// axis every frame, so consumers (e.g. WASD movement) steer relative to
	// the view without knowing this camera exists.
	$effect(() => {
		const scene = sceneCtx.scene;
		const cam = camera;
		if (!cam || !scene || !axis) return;
		const observer = scene.onBeforeRenderObservable.add(() => {
			const forward = cam.target.subtract(cam.position);
			forward.y = 0;
			forward.normalize();
			axis.front.copyFrom(forward);
		});
		return () => {
			scene.onBeforeRenderObservable.remove(observer);
		};
	});

	// Attach orbit controls once camera and canvas are both available.
	$effect(() => {
		if (!camera || !engineCtx.canvas) return;
		camera.attachControl(engineCtx.canvas, true);
	});
</script>
