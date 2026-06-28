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
		color: var(--color-primary);
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		box-shadow: var(--glow-primary);
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		color: var(--color-bg);
		background: var(--color-primary);
	}
</style>
