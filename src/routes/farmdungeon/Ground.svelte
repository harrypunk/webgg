<script lang="ts">
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
	import { Texture } from '@babylonjs/core/Materials/Textures/texture';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		name?: string;
		size?: number;
		tiles?: number;
	}

	let { name = 'ground', size = 32, tiles = 8 }: Props = $props();

	const sceneCtx = getSceneContext();

	const TEXTURE_DIR = '/textures/brown_mud';

	// Creation effect only: `name`, `size` and `tiles` are create-only (geometry
	// and material are fixed at construction) — changing them rebuilds the mesh.
	$effect(() => {
		if (!sceneCtx.scene) return;
		const scene = sceneCtx.scene;

		const ground = MeshBuilder.CreateGround(name, { width: size, height: size }, scene);

		// Poly Haven tileable PBR set: diffuse, OpenGL normal map, and ARM
		// (AO in red, roughness in green, metallic in blue).
		const albedo = new Texture(`${TEXTURE_DIR}/diff.jpg`, scene);
		const normal = new Texture(`${TEXTURE_DIR}/nor_gl.jpg`, scene);
		const arm = new Texture(`${TEXTURE_DIR}/arm.jpg`, scene);
		for (const texture of [albedo, normal, arm]) {
			texture.uScale = tiles;
			texture.vScale = tiles;
		}

		const mat = new PBRMaterial(`${name}Mat`, scene);
		mat.albedoTexture = albedo;
		mat.bumpTexture = normal;
		mat.metallicTexture = arm;
		mat.useAmbientOcclusionFromMetallicTextureRed = true;
		mat.useRoughnessFromMetallicTextureGreen = true;
		mat.useMetallnessFromMetallicTextureBlue = true;
		// Texture values multiply the scalars — 1.0 lets the maps speak for themselves.
		mat.metallic = 1;
		mat.roughness = 1;
		ground.material = mat;
		ground.receiveShadows = true;

		return () => {
			ground.dispose();
			mat.dispose();
			albedo.dispose();
			normal.dispose();
			arm.dispose();
		};
	});
</script>
