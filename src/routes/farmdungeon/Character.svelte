<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		size?: number;
	}

	let { name = 'character', size = 1 }: Props = $props();

	const sceneCtx = getSceneContext();

	// Creation effect only: `name` and `size` are create-only — changing them
	// rebuilds the mesh.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const cube = MeshBuilder.CreateBox(name, { size }, sceneCtx.scene);
		const mat = new StandardMaterial(`${name}Mat`, sceneCtx.scene);
		mat.diffuseColor = new Color3(0.9, 0.5, 0.2);
		mat.specularColor = new Color3(0.1, 0.1, 0.1);
		cube.material = mat;
		// Rest the cube on the grass instead of sinking halfway into it.
		cube.position.y = size / 2;

		return () => {
			cube.dispose();
			mat.dispose();
		};
	});
</script>
