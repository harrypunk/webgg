<script lang="ts">
	import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
	import { Camera } from '@babylonjs/core/Cameras/camera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
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

	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		const camera = new UniversalCamera(name, position.clone(), scene);
		camera.setTarget(target.clone());
		camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

		const engine = scene.getEngine();

		const updateBounds = () => {
			const aspect = engine.getRenderWidth() / engine.getRenderHeight();
			camera.orthoTop = worldHeight / 2;
			camera.orthoBottom = -worldHeight / 2;
			camera.orthoLeft = (-worldHeight / 2) * aspect;
			camera.orthoRight = (worldHeight / 2) * aspect;
		};
		updateBounds();

		const resizeObserver = engine.onResizeObservable.add(updateBounds);

		return () => {
			engine.onResizeObservable.remove(resizeObserver);
			camera.dispose();
		};
	});
</script>
