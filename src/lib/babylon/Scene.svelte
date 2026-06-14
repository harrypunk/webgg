<script lang="ts">
	import { Scene } from '@babylonjs/core/scene';
	import type { Nullable } from '@babylonjs/core/types';
	import { getEngineContext, setSceneContext } from './context';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
	const engineCtx = getEngineContext();
	const sceneCtx = $state<{ scene: Nullable<Scene> }>({ scene: null });
	setSceneContext(sceneCtx);

	$effect(() => {
		if (!engineCtx.engine) return;

		const scene = new Scene(engineCtx.engine);
		sceneCtx.scene = scene;

		engineCtx.engine.runRenderLoop(() => {
			if (scene.activeCamera) {
				scene.render();
			}
		});

		return () => {
			engineCtx.engine?.stopRenderLoop();
			scene.dispose();
			sceneCtx.scene = null;
		};
	});
</script>

{#if sceneCtx.scene}
	{@render children?.()}
{/if}
