<script lang="ts">
	import { Scene } from '@babylonjs/core/scene';
	import type { Nullable } from '@babylonjs/core/types';
	import { getEngineContext, setSceneContext, type SceneContext } from './context';
	import type { Snippet } from 'svelte';

	interface Props {
		scene?: Nullable<Scene>;
		children?: Snippet;
	}

	let {
		// eslint-disable-next-line no-useless-assignment
		scene = $bindable(null),
		children
	}: Props = $props();

	const engineCtx = getEngineContext();
	const sceneCtx = $state<SceneContext>({ scene: null });
	setSceneContext(sceneCtx);

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
</script>

{#if sceneCtx.scene}
	{@render children?.()}
{/if}
