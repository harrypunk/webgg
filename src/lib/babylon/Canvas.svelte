<script lang="ts">
	import { Engine } from '@babylonjs/core/Engines/engine';
	import type { Nullable } from '@babylonjs/core/types';
	import { setEngineContext, type EngineContext } from './context';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		element?: HTMLElement;
	}

	let { children, element = $bindable() }: Props = $props();

	let canvasRef = $state<Nullable<HTMLCanvasElement>>(null);
	let width = $state(0);
	let height = $state(0);

	const engineCtx = $state<EngineContext>({
		engine: null,
		canvas: null
	});
	setEngineContext(engineCtx);

	/** Create engine once when canvas mounts. */
	$effect(() => {
		if (!canvasRef) return;

		const engine = new Engine(canvasRef, true);
		engineCtx.engine = engine;
		engineCtx.canvas = canvasRef;

		return () => {
			engine.dispose();
			engineCtx.engine = null;
			engineCtx.canvas = null;
		};
	});

	/**
	 * Sync pixel buffer and notify Babylon whenever the CSS box size changes.
	 * `bind:clientWidth` / `bind:clientHeight` feed these reactively.
	 */
	$effect(() => {
		if (!canvasRef) return;
		if (!engineCtx.engine) return;

		canvasRef.width = width;
		canvasRef.height = height;
		engineCtx.engine.resize();
	});
</script>

<div class="canvas-wrap" bind:this={element} bind:clientWidth={width} bind:clientHeight={height}>
	<canvas bind:this={canvasRef}></canvas>
	{@render children?.()}
</div>

<style>
	.canvas-wrap {
		position: relative;
		flex: 1;
		min-height: 0;
		border: 2px solid var(--color-primary);
		overflow: hidden;
		background: var(--color-bg);
		box-shadow: var(--glow-primary-lg);
		width: 100%;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		outline: none;
	}
</style>
