<script lang="ts">
	import { Fullscreen, Minimize } from 'lucide-svelte';

	let { ...props } = $props();
</script>

<button type="button" class="fullscreen-icon" aria-label="Toggle fullscreen" {...props}>
	<span class="icon icon-enter" aria-hidden="true">
		<Fullscreen size={20} />
	</span>
	<span class="icon icon-exit" aria-hidden="true">
		<Minimize size={20} />
	</span>
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

	.icon-exit {
		display: none;
	}

	button:global(.is-fullscreen) .icon-enter {
		display: none;
	}

	button:global(.is-fullscreen) .icon-exit {
		display: inline;
	}
</style>
