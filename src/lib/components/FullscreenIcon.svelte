<script lang="ts">
	import { Fullscreen, Minimize } from 'lucide-svelte';
	import type { FullscreenController } from '$lib/attachments/fullscreen.svelte.js';

	interface Props {
		fullscreenController: FullscreenController;
	}

	let { fullscreenController }: Props = $props();
</script>

<button
	type="button"
	class="fullscreen-icon"
	class:is-fullscreen={fullscreenController.isFullscreen}
	aria-label={fullscreenController.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
	onclick={fullscreenController.toggle}
>
	{#if fullscreenController.isFullscreen}
		<span class="icon" aria-hidden="true"><Minimize size={20} /></span>
	{:else}
		<span class="icon" aria-hidden="true"><Fullscreen size={20} /></span>
	{/if}
</button>

<style>
	button {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		z-index: 10;
		padding: 0.5rem;
		color: #00ff41;
		background: #000;
		border: 2px solid #00ff41;
		box-shadow: 0 0 8px #00ff41;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		color: #000;
		background: #00ff41;
	}
</style>
