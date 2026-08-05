<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import type { Nullable } from '@babylonjs/core/types';
	import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import { getSceneContext } from '$lib/babylon/context';
	import { useMovement } from '$lib/babylon/useMovement';
	import type { ViewAxis } from './viewAxis';

	interface Props {
		name?: string;
		size?: number;
		speed?: number;
		/** Shared view axis (owned by the camera) steering WASD movement. */
		axis?: Nullable<ViewAxis>;
		shadowGenerator?: Nullable<ShadowGenerator>;
		mesh?: Nullable<Mesh>;
	}

	let {
		name = 'character',
		size = 1,
		speed = 5,
		axis = null,
		shadowGenerator = null,
		mesh = $bindable(null)
	}: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect only: `name` and `size` are create-only — changing them
	// rebuilds the mesh. `speed` and `axis` are passed as getters so they are
	// read live every frame instead of being tracked by this effect.
	$effect(() => {
		if (!sceneCtx.scene) return;

		// A cone: a cylinder with a zero-width top.
		const character = MeshBuilder.CreateCylinder(
			name,
			{ diameterTop: 0, diameterBottom: size, height: size },
			sceneCtx.scene
		);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(0.9, 0.5, 0.2);
		mat.specularColor = new Color3(0.1, 0.1, 0.1);
		character.material = mat;
		// Lay the cone on its side with the apex pointing +z (movement forward),
		// and bake the pose so plain rotation.y can steer the heading.
		character.rotation.x = Math.PI / 2;
		character.bakeCurrentTransformIntoVertices();
		character.rotation.x = 0;
		// Rest the cone on the grass: lying flat, its radius is half the size.
		character.position.y = size / 2;
		mesh = character;

		const detachMovement = useMovement(sceneCtx.scene, character, {
			speed: () => speed,
			upKey: 'KeyW',
			downKey: 'KeyS',
			frontAxis: () => axis?.front ?? null,
			faceForward: true
		});

		return () => {
			detachMovement();
			mesh = null;
			character.dispose();
			mat.dispose();
		};
	});

	// Synced subscription: keep the shadow generator's caster list in sync with
	// the character and generator instances, with cleanup on change or teardown.
	$effect(() => {
		const m = mesh;
		const sg = shadowGenerator;
		if (!m || !sg) return;
		sg.addShadowCaster(m);
		return () => {
			sg.removeShadowCaster(m);
		};
	});
</script>
