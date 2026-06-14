<script lang="ts">
	import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
	import { SpotLight } from '@babylonjs/core/Lights/spotLight';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { Mesh } from '@babylonjs/core/Meshes/mesh';
	import { getSceneContext } from '$lib/babylon/context';

	interface Props {
		floorWidth?: number;
		floorHeight?: number;
		glowIntensity?: number;
	}

	let { floorWidth = 8, floorHeight = 14, glowIntensity = 1.2 }: Props = $props();

	const sceneCtx = getSceneContext();

	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		const halfW = floorWidth / 2;
		const halfH = floorHeight / 2;

		// Strong bloom for the golden DMC vibe.
		const glow = new GlowLayer('floorGlow', scene);
		glow.intensity = glowIntensity;

		// Golden light beams at the four corners of the floor, pointing inward
		// to frame / "block" the game area like a sci-fi arena.
		const beamColor = new Color3(1, 0.7, 0.15);
		// Place beams outside the floor corners so they frame rather than crowd the play area.
		const corners = [
			{ x: -halfW * 1.3, z: -halfH * 1.3 },
			{ x: halfW * 1.3, z: -halfH * 1.3 },
			{ x: -halfW * 1.3, z: halfH * 1.3 },
			{ x: halfW * 1.3, z: halfH * 1.3 }
		];

		const beams: { light: SpotLight; cone: ReturnType<typeof MeshBuilder.CreateCylinder> }[] = [];

		for (let i = 0; i < corners.length; i++) {
			const { x, z } = corners[i];
			const origin = new Vector3(x, 5, z);
			const target = new Vector3(x * 0.1, 0, z * 0.1);
			const dir = target.subtract(origin).normalize();

			const light = new SpotLight(`beamLight${i}`, origin, dir, Math.PI / 3, 2, scene);
			light.diffuse = beamColor;
			light.specular = new Color3(0, 0, 0);
			light.intensity = 2.5;
			light.range = 22;

			// Fake volumetric beam: thin, very transparent glowing cone.
			const cone = MeshBuilder.CreateCylinder(
				`beamCone${i}`,
				{ diameterTop: 0.15, diameterBottom: 2.2, height: 9, tessellation: 16 },
				scene
			);
			cone.position = origin.add(dir.scale(3.5));
			cone.lookAt(target);
			cone.rotation.x += Math.PI / 2;

			const coneMat = new StandardMaterial(`beamMat${i}`, scene);
			coneMat.emissiveColor = beamColor;
			coneMat.disableLighting = true;
			coneMat.alpha = 0.06;
			cone.material = coneMat;

			beams.push({ light, cone });
		}

		// Sweeping wave lights that travel across the floor, creating moving light pools.
		const waveColor = new Color3(1, 0.55, 0.1);
		const waves: SpotLight[] = [];
		for (let i = 0; i < 3; i++) {
			const light = new SpotLight(
				`waveLight${i}`,
				new Vector3(0, 4, -halfH),
				new Vector3(0, -1, 0),
				Math.PI / 4,
				2,
				scene
			);
			light.diffuse = waveColor;
			light.specular = new Color3(0, 0, 0);
			light.intensity = 1.5;
			light.range = 14;
			waves.push(light);
		}

		// Visible expanding wave rings around the floor — decorative golden ripples.
		const ringMat = new StandardMaterial('waveRingMat', scene);
		ringMat.emissiveColor = new Color3(1, 0.7, 0.15);
		ringMat.disableLighting = true;
		ringMat.alpha = 0.25;

		// Front ring: flat torus on the front edge.
		// Side rings: half-arch tubes in the YZ plane so they spread along the edge and upward,
		// never into the play area (X direction).
		const ringConfigs: {
			x: number;
			z: number;
			build: (name: string) => Mesh;
		}[] = [
			{
				x: 0,
				z: halfH,
				build: (name) =>
					MeshBuilder.CreateTorus(name, { diameter: 1, thickness: 0.04, tessellation: 32 }, scene)
			},
			{
				x: -halfW,
				z: 0,
				build: (name) => {
					const path: Vector3[] = [];
					for (let a = 0; a <= Math.PI; a += 0.15) {
						path.push(new Vector3(0, Math.sin(a), Math.cos(a)));
					}
					return MeshBuilder.CreateTube(
						name,
						{ path, radius: 0.04, sideOrientation: Mesh.DOUBLESIDE },
						scene
					);
				}
			},
			{
				x: halfW,
				z: 0,
				build: (name) => {
					const path: Vector3[] = [];
					for (let a = 0; a <= Math.PI; a += 0.15) {
						path.push(new Vector3(0, Math.sin(a), Math.cos(a)));
					}
					return MeshBuilder.CreateTube(
						name,
						{ path, radius: 0.04, sideOrientation: Mesh.DOUBLESIDE },
						scene
					);
				}
			}
		];

		const ringSets = ringConfigs.map((config, i) => {
			const rings: Mesh[] = [];
			for (let r = 0; r < 3; r++) {
				const ring = config.build(`waveRing${i}_${r}`);
				ring.position.set(config.x, 0.05, config.z);
				// Front ring lies flat on the floor; side arches are already built in YZ plane.
				if (i === 0) {
					ring.rotation.x = Math.PI / 2;
				}
				ring.material = ringMat;
				rings.push(ring);
			}
			return { rings, phase: i * 1.2 };
		});

		// Animate beams swaying and pulsing subtly, plus wave lights sweeping the floor.
		const update = () => {
			const t = performance.now() * 0.001;

			for (let i = 0; i < beams.length; i++) {
				const b = beams[i];
				const sway = Math.sin(t * 0.4 + i) * 0.1;
				b.light.direction.x += sway * 0.015;
				b.light.direction.z += sway * 0.015;
				b.light.intensity = 2 + Math.sin(t * 1.5 + i) * 0.5;
				b.cone.rotation.z = sway;
			}

			for (let i = 0; i < waves.length; i++) {
				const w = waves[i];
				const phase = i * ((Math.PI * 2) / waves.length);
				const z = Math.sin(t * 0.8 + phase) * halfH;
				const x = Math.sin(t * 0.5 + phase) * halfW * 0.6;
				w.position.set(x, 4, z);
				w.direction.set(-x * 0.2, -1, -z * 0.2);
				w.intensity = 1 + Math.sin(t * 2 + phase) * 0.4;
			}

			// Pulse the decorative rings outward.
			for (const set of ringSets) {
				for (let r = 0; r < set.rings.length; r++) {
					const ring = set.rings[r];
					const offset = r * 1.5;
					const cycle = (t * 1.2 + set.phase + offset) % 4;
					const progress = cycle / 4;
					ring.scaling.setAll(1 + progress * 5);
					(ring.material as StandardMaterial).alpha = 0.3 * (1 - progress);
				}
			}
		};

		const obs = scene.onBeforeRenderObservable.add(update);

		return () => {
			scene.onBeforeRenderObservable.remove(obs);
			glow.dispose();
			for (const b of beams) {
				b.light.dispose();
				b.cone.dispose();
				b.cone.material?.dispose();
			}
			for (const w of waves) {
				w.dispose();
			}
			for (const set of ringSets) {
				for (const ring of set.rings) {
					ring.dispose();
				}
			}
			ringMat.dispose();
		};
	});
</script>
