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
		color: #00ff41;
		background: #000;
		border: 2px solid #00ff41;
		box-shadow: 0 0 8px #00ff41;
		cursor: pointer;
	}

	.debug-btn:hover {
		color: #000;
		background: #00ff41;
	}
</style>
