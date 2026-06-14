<script lang="ts">
	import { Fullscreen, Minimize } from 'lucide-svelte';

	let { ...props } = $props();
</script>

<button type="button" class="fullscreen-btn" {...props}>
	<span class="icon icon-enter" aria-hidden="true">
		<Fullscreen size={18} />
	</span>
	<span class="icon icon-exit" aria-hidden="true">
		<Minimize size={18} />
	</span>
	<span class="label label-enter">Fullscreen</span>
	<span class="label label-exit">Exit Fullscreen</span>
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

	.icon-exit,
	.label-exit {
		display: none;
	}

	button:global(.is-fullscreen) .icon-enter,
	button:global(.is-fullscreen) .label-enter {
		display: none;
	}

	button:global(.is-fullscreen) .icon-exit,
	button:global(.is-fullscreen) .label-exit {
		display: inline;
	}
</style>
