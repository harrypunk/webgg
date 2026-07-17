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
	 * Notify Babylon whenever the CSS box size changes so it resizes the pixel
	 * buffer and fires `engine.onResizeObservable`. `bind:clientWidth` /
	 * `bind:clientHeight` feed these reactively. Babylon owns the buffer size:
	 * setting `canvas.width` manually here would pre-empt its change detection
	 * in `setSize` and swallow the resize notification.
	 */
	$effect(() => {
		if (!canvasRef) return;
		if (!engineCtx.engine) return;
		if (!width || !height) return;

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
		/* Fill the wrapper via absolute positioning: in-flow percentage heights
		 * don't resolve against flex-resolved parents, which let the canvas fall
		 * back to its intrinsic buffer ratio and left the wrapper's background
		 * exposed below it. Absolute positioning resolves against the wrapper's
		 * used size instead. */
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		outline: none;
	}
</style>
