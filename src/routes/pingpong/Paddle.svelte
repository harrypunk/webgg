<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import type { Mesh } from '@babylonjs/core/Meshes/mesh';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import type { Nullable } from '@babylonjs/core/types';
	import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
	import { getSceneContext } from '$lib/babylon/context';
	import { useMovement } from '$lib/babylon/useMovement';
	import '@babylonjs/core/Collisions/collisionCoordinator';

	interface Props {
		name?: string;
		width?: number;
		height?: number;
		depth?: number;
		startX?: number;
		startZ?: number;
		speed?: number;
		shadowGenerator?: Nullable<ShadowGenerator>;
	}

	let {
		name = 'paddle',
		width = 1.5,
		height = 0.15,
		depth = 0.25,
		startX = 0,
		startZ = -4,
		speed = 6,
		shadowGenerator
	}: Props = $props();

	const sceneCtx = getSceneContext();
	let paddle = $state<Nullable<Mesh>>(null);

	// The paddle slides along world x, so its forward axis is fixed.
	const FRONT_AXIS = new Vector3(0, 0, 1);

	// Creation effect: `name`, dimensions and start position are create-only —
	// changing them rebuilds the mesh. `speed` is passed as a getter so it is
	// read live every frame instead of being tracked by this effect.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const newPaddle = MeshBuilder.CreateBox(name, { width, height, depth }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(1, 1, 1);
		mat.specularColor = new Color3(0.2, 0.2, 0.2);
		newPaddle.material = mat;
		newPaddle.position.x = startX;
		newPaddle.position.z = startZ;
		newPaddle.position.y = 1.5;
		// Match the collision volume to the paddle's actual size so it stops right at the walls.
		newPaddle.ellipsoid = new Vector3(width / 2, height / 2, depth / 2);
		newPaddle.checkCollisions = true;

		paddle = newPaddle;
		const detachMovement = useMovement(sceneCtx.scene, {
			speed: () => speed,
			frontAxis: () => FRONT_AXIS,
			onMove: (d) => newPaddle.moveWithCollisions(d)
		});

		return () => {
			detachMovement();
			paddle = null;
			newPaddle.dispose();
			mat.dispose();
		};
	});

	// Synced subscription: keep the shadow generator's caster list in sync with
	// the paddle and generator instances, with cleanup on change or teardown.
	$effect(() => {
		const p = paddle;
		const sg = shadowGenerator;
		if (!p || !sg) return;
		sg.addShadowCaster(p);
		return () => {
			sg.removeShadowCaster(p);
		};
	});
</script>
