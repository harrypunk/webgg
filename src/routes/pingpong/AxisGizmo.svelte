<script lang="ts">
	/**
	 * AxisGizmo draws a small XYZ arrow indicator that is pinned to a corner of the canvas.
	 *
	 * How it is shown on the canvas:
	 * - The gizmo is rendered through a UtilityLayerRenderer, which draws a separate
	 *   overlay scene on top of the main scene using the same camera. This keeps the
	 *   indicator in front of everything without depth-buffer tricks.
	 * - Every frame we compute where the desired screen corner is in 3D world space,
	 *   then move the gizmo there. This keeps it visually stuck to the canvas corner
	 *   even when the camera moves or rotates.
	 * - The arrows stay aligned with world axes (red = +X, green = +Y, blue = +Z),
	 *   so the gizmo always shows the current view orientation relative to the world.
	 * - The X/Y/Z labels are drawn with `@babylonjs/gui` `TextBlock` controls linked
	 *   to small anchor nodes at the arrow tips. This keeps text crisp and always on top.
	 */

	import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
	import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
	import { Mesh } from '@babylonjs/core/Meshes/mesh';
	import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
	import { Color3 } from '@babylonjs/core/Maths/math.color';
	import { Vector3 } from '@babylonjs/core/Maths/math.vector';
	import { Matrix } from '@babylonjs/core/Maths/math.vector';
	import { UtilityLayerRenderer } from '@babylonjs/core/Rendering/utilityLayerRenderer';
	import '@babylonjs/core/Culling/ray';
	import type { Scene } from '@babylonjs/core/scene';
	import type { Nullable } from '@babylonjs/core/types';
	import { untrack } from 'svelte';
	import { getSceneContext } from '$lib/babylon/context';
	import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
	import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock';
	import { Control } from '@babylonjs/gui/2D/controls/control';

	interface Props {
		visible?: boolean;
		size?: number;
		distance?: number;
	}

	let { visible = true, size = 0.4, distance = 4 }: Props = $props();

	const sceneCtx = getSceneContext();
	// Plain (non-reactive) reference to the built gizmo node. We do not use $state
	// because assigning it must not re-trigger the creation effect.
	let gizmoNode: Nullable<TransformNode> = null;
	let labelRoot: Nullable<AdvancedDynamicTexture> = null;

	const AXES = [
		{ dir: new Vector3(1, 0, 0), color: new Color3(1, 0, 0), name: 'X' },
		{ dir: new Vector3(0, 1, 0), color: new Color3(0, 1, 0), name: 'Y' },
		{ dir: new Vector3(0, 0, 1), color: new Color3(0, 0.5, 1), name: 'Z' }
	];

	function alignToDir(mesh: Mesh, dir: Vector3) {
		const yAxis = dir.normalize();
		let xAxis = Vector3.Cross(Vector3.Up(), yAxis);
		if (xAxis.lengthSquared() < 0.0001) {
			xAxis = Vector3.Right();
		} else {
			xAxis.normalize();
		}
		const zAxis = Vector3.Cross(xAxis, yAxis).normalize();
		mesh.rotation = Vector3.RotationFromAxis(xAxis, yAxis, zAxis);
	}

	function buildGizmo(scene: Scene) {
		const node = new TransformNode('axisGizmoRoot', scene);
		const anchors: TransformNode[] = [];

		for (const { dir, color, name } of AXES) {
			const mat = new StandardMaterial(`axisGizmo${name}Mat`, scene);
			mat.emissiveColor = color;
			mat.disableLighting = true;

			const shaft = MeshBuilder.CreateCylinder(
				`axisGizmo${name}Shaft`,
				{ diameter: size * 0.06, height: size * 0.7, tessellation: 8 },
				scene
			);
			shaft.material = mat;
			shaft.position = dir.scale(size * 0.35);
			alignToDir(shaft, dir);
			shaft.parent = node;

			const head = MeshBuilder.CreateCylinder(
				`axisGizmo${name}Head`,
				{ diameterTop: 0, diameterBottom: size * 0.12, height: size * 0.3, tessellation: 8 },
				scene
			);
			head.material = mat;
			head.position = dir.scale(size * 0.85);
			alignToDir(head, dir);
			head.parent = node;

			// Invisible anchor used by the GUI label to follow the arrow tip.
			const anchor = new TransformNode(`axisGizmo${name}Anchor`, scene);
			anchor.position = dir.scale(size * 1.15);
			anchor.parent = node;
			anchors.push(anchor);
		}

		return { node, anchors };
	}

	function buildLabels(scene: Scene, anchors: TransformNode[]) {
		const adt = AdvancedDynamicTexture.CreateFullscreenUI('axisGizmoLabels', true, scene);
		adt.isForeground = true;
		adt.renderAtIdealSize = false;

		for (let i = 0; i < anchors.length; i++) {
			const anchor = anchors[i];
			const { color, name } = AXES[i];

			const text = new TextBlock(`axisGizmo${name}Label`, name);
			text.color = color.toHexString();
			text.fontSizeInPixels = 24;
			text.fontWeight = 'bold';
			text.fontFamily = 'monospace';
			text.outlineWidth = 3;
			text.outlineColor = 'black';
			text.shadowBlur = 4;
			text.shadowColor = 'black';
			text.shadowOffsetY = 2;
			text.resizeToFit = true;
			text.isHitTestVisible = false;

			// linkWithMesh requires the control to be at root level, so add it first.
			adt.addControl(text);
			text.linkWithMesh(anchor);

			// linkWithMesh resets alignment to left/top; restore center alignment
			// so the label is centered on the arrow tip.
			text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
			text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
		}

		return adt;
	}

	// Effect 1: create the gizmo once the Babylon scene exists, and keep its
	// screen-corner position updated every frame. It depends only on the scene.
	$effect(() => {
		if (!sceneCtx.scene) return;

		const scene = sceneCtx.scene;
		// Render the gizmo in an overlay scene so it always appears in front.
		const utilityLayer = new UtilityLayerRenderer(scene);
		const { node, anchors } = buildGizmo(utilityLayer.utilityLayerScene);
		const labels = buildLabels(scene, anchors);

		// Set the initial enabled state from the current `visible` prop without
		// subscribing this effect to future `visible` changes. Toggling visibility
		// is handled by the second effect so we do not rebuild the gizmo each time.
		const initialVisible = untrack(() => visible);
		node.setEnabled(initialVisible);
		labels.rootContainer.isVisible = initialVisible;
		gizmoNode = node;
		labelRoot = labels;

		const update = () => {
			const camera = scene.activeCamera;
			const engine = scene.getEngine();
			if (!camera || !engine) return;

			const width = engine.getRenderWidth();
			const height = engine.getRenderHeight();

			// Place the gizmo near the top-left corner, slightly inset.
			// Smaller x = closer to the left edge; larger y = lower on the screen.
			const x = width * 0.1;
			const y = height * 0.18;

			// Unproject that screen pixel to two world points: at the near and far planes.
			const near = Vector3.Unproject(
				new Vector3(x, y, 0),
				width,
				height,
				Matrix.Identity(),
				camera.getViewMatrix(),
				camera.getProjectionMatrix()
			);
			const far = Vector3.Unproject(
				new Vector3(x, y, 1),
				width,
				height,
				Matrix.Identity(),
				camera.getViewMatrix(),
				camera.getProjectionMatrix()
			);

			// The ray from camera through that corner gives us the world direction.
			// Place the gizmo along that ray at the configured distance from the camera.
			const dir = far.subtract(near).normalize();
			node.position = near.add(dir.scale(distance));

			// Keep the arrows aligned with world axes (red = +X, green = +Y, blue = +Z).
			node.rotation = Vector3.Zero();
		};

		update();
		const obs = scene.onBeforeRenderObservable.add(update);

		return () => {
			scene.onBeforeRenderObservable.remove(obs);
			labels.dispose();
			utilityLayer.dispose();
			gizmoNode = null;
			labelRoot = null;
		};
	});

	// Effect 2: react only to `visible` changes and toggle the existing gizmo.
	// Separated from effect 1 to avoid destroying/recreating the node on toggle.
	$effect(() => {
		gizmoNode?.setEnabled(visible);
		if (labelRoot) {
			labelRoot.rootContainer.isVisible = visible;
		}
	});
</script>
