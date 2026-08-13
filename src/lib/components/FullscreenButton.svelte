<script lang="ts">
	import { Fullscreen, Minimize } from 'lucide-svelte';
	import type { FullscreenController } from '$lib/attachments/fullscreen.svelte.js';

	interface Props {
		fullscreenController: FullscreenController;
	}

	let { fullscreenController }: Props = $props();
</script>

<!-- Styled by the universal `.side-panel button` rules in app.css. -->
<button
	type="button"
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
