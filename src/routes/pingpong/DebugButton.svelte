<script lang="ts">
	interface Props {
		debug?: boolean;
	}

	let { debug = $bindable(false) }: Props = $props();
</script>

<button type="button" class="debug-btn" onclick={() => (debug = !debug)}>
	Debug: {debug ? 'ON' : 'OFF'}
</button>

<style>
	.debug-btn {
		padding: 0.5rem 1rem;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-primary);
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		box-shadow: var(--glow-primary);
		cursor: pointer;
	}

	.debug-btn:hover {
		color: var(--color-bg);
		background: var(--color-primary);
	}
</style>
