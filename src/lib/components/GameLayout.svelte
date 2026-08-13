<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createFullscreen } from '$lib/attachments/fullscreen.svelte.js';
	import FullscreenButton from './FullscreenButton.svelte';
	import FullscreenIcon from './FullscreenIcon.svelte';

	interface Props {
		title: string;
		/** The game canvas. */
		children: Snippet;
		/** Info and option controls for the side panel. */
		panel?: Snippet;
	}

	let { title, children, panel }: Props = $props();

	let canvasPane = $state<HTMLElement>();
	// Fullscreen targets the whole pane so the corner icon stays visible
	// while fullscreen is active.
	const fullscreenController = createFullscreen(() => canvasPane);
</script>

<section class="page">
	<h1>{title}</h1>
	<div class="game-layout">
		<div class="canvas-pane" bind:this={canvasPane}>
			{@render children()}
			<FullscreenIcon {fullscreenController} />
		</div>
		<aside class="side-panel">
			{@render panel?.()}
			<FullscreenButton {fullscreenController} />
		</aside>
	</div>
</section>
