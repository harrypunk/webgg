<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		size?: number;
	}

	let { name = 'grassland', size = 32 }: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect only: `name` and `size` are create-only (geometry is
	// fixed at construction) — changing them rebuilds the mesh.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const ground = MeshBuilder.CreateGround(name, { width: size, height: size }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(0.35, 0.6, 0.25);
		// Matte grass: kill the specular highlight so the sun light reads soft.
		mat.specularColor = new Color3(0, 0, 0);
		ground.material = mat;

		return () => {
			ground.dispose();
			mat.dispose();
		};
	});
</script>
