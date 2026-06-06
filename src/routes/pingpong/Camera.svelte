<script lang="ts">
	import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { getSceneContext } from './context';

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

	$effect(() => {
		if (!sceneCtx.scene) return;

		const camera = new TargetCamera(name, position, sceneCtx.scene);
		camera.setTarget(target);

		return () => {
			camera.dispose();
		};
	});
</script>
