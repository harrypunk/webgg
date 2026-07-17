<script lang="ts">
	import { Scene } from '@babylonjs/core/scene';
	import type { Nullable } from '@babylonjs/core/types';
	import { Color4 } from '@babylonjs/core/Maths/math.color';
	import { getEngineContext, setSceneContext, type SceneContext } from './context';
	import type { Snippet } from 'svelte';

	interface Props {
		scene?: Nullable<Scene>;
		clearColor?: Color4;
		children?: Snippet;
	}

	let {
		// eslint-disable-next-line no-useless-assignment
		scene = $bindable(null),
		clearColor,
		children
	}: Props = $props();

	const engineCtx = getEngineContext();
	const sceneCtx = $state<SceneContext>({ scene: null });
	setSceneContext(sceneCtx);

	// Creation effect: reads only the engine context — no props — so a prop
	// change can never trigger a scene rebuild.
	$effect(() => {
		if (!engineCtx.engine) return;

		const newScene = new Scene(engineCtx.engine);
		sceneCtx.scene = newScene;
		scene = newScene;

		engineCtx.engine.runRenderLoop(() => {
			if (newScene.activeCamera) {
				newScene.render();
			}
		});

		return () => {
			engineCtx.engine?.stopRenderLoop();
			newScene.dispose();
			sceneCtx.scene = null;
			scene = null;
		};
	});

	// Synced prop: mutate the live scene in place — no rebuild.
	$effect(() => {
		if (!sceneCtx.scene || !clearColor) return;
		sceneCtx.scene.clearColor = clearColor;
	});
</script>

{#if sceneCtx.scene}
	{@render children?.()}
{/if}
