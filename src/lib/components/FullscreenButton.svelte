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
	class="fullscreen-btn"
	class:is-fullscreen={fullscreenController.isFullscreen}
	aria-label={fullscreenController.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
	onclick={fullscreenController.toggle}
>
	{#if fullscreenController.isFullscreen}
		<span class="icon" aria-hidden="true"><Minimize size={18} /></span>
		<span class="label">Exit Fullscreen</span>
	{:else}
		<span class="icon" aria-hidden="true"><Fullscreen size={18} /></span>
		<span class="label">Fullscreen</span>
	{/if}
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		color: #00ff41;
		background: #000;
		border: 2px solid #00ff41;
		box-shadow: 0 0 8px #00ff41;
		cursor: pointer;
	}

	button:hover {
		color: #000;
		background: #00ff41;
	}
</style>
