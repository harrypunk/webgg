<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';
	import type { Camera } from '@babylonjs/core/Cameras/camera';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import { getSceneContext } from '$lib/babylon/context';
	import { useMovement } from '$lib/babylon/useMovement';

	interface Props {
		name?: string;
		size?: number;
		speed?: number;
		/** Orbit camera used to make WASD movement camera-relative. */
		camera?: Nullable<Camera>;
		mesh?: Nullable<Mesh>;
	}

	let {
		name = 'character',
		size = 1,
		speed = 5,
		camera = null,
		// eslint-disable-next-line no-useless-assignment
		mesh = $bindable(null)
	}: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect only: `name` and `size` are create-only — changing them
	// rebuilds the mesh. `speed` and `camera` are passed as getters so they are
	// read live every frame instead of being tracked by this effect.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cube = MeshBuilder.CreateBox(name, { size }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(0.9, 0.5, 0.2);
		mat.specularColor = new Color3(0.1, 0.1, 0.1);
		cube.material = mat;
		// Rest the cube on the grass instead of sinking halfway into it.
		cube.position.y = size / 2;
		mesh = cube;

		const detachMovement = useMovement(sceneCtx.scene, cube, {
			speed: () => speed,
			upKey: 'KeyW',
			downKey: 'KeyS',
			camera: () => camera
		});

		return () => {
			detachMovement();
			mesh = null;
			cube.dispose();
			mat.dispose();
		};
	});
</script>
